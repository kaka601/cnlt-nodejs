// =============================================
//  ChatApp Realtime - Client-side Logic
// =============================================

const socket = io();

// --- State ---
let myId       = null;
let myUsername = null;
let chatWith   = null;  // { id, username }
const chatHistory = {}; // { userId: [ message, ... ] }
const unreadCounts = {}; // { userId: count }

// --- DOM Elements ---
const loginScreen        = document.getElementById('login-screen');
const chatScreen         = document.getElementById('chat-screen');
const joinForm           = document.getElementById('join-form');
const usernameInput      = document.getElementById('username-input');
const joinError          = document.getElementById('join-error');
const myNameDisplay      = document.getElementById('my-name-display');
const myAvatar           = document.getElementById('my-avatar');
const userList           = document.getElementById('user-list');
const userCount          = document.getElementById('user-count');
const noChatDiv          = document.getElementById('no-chat');
const chatWindow         = document.getElementById('chat-window');
const chatAvatar         = document.getElementById('chat-avatar');
const chatUsername       = document.getElementById('chat-username');
const messagesContainer  = document.getElementById('messages-container');
const messageForm        = document.getElementById('message-form');
const messageInput       = document.getElementById('message-input');
const closeChatBtn       = document.getElementById('close-chat-btn');
const logoutBtn          = document.getElementById('logout-btn');
const toastContainer     = document.getElementById('toast-container');

// =============================================
//  HELPERS
// =============================================

function getInitial(name) {
  return name ? name.charAt(0).toUpperCase() : '?';
}

function formatTime(iso) {
  const d = new Date(iso);
  const h = String(d.getHours()).padStart(2, '0');
  const m = String(d.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

function generateColor(str) {
  const colors = [
    'linear-gradient(135deg,#7c6aff,#ff6ab0)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
    'linear-gradient(135deg,#f97316,#eab308)',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

function showError(msg) {
  joinError.textContent = msg;
  joinError.classList.remove('hidden');
}

function hideError() {
  joinError.classList.add('hidden');
  joinError.textContent = '';
}

// =============================================
//  TOAST NOTIFICATIONS
// =============================================

function showToast(message, type = 'msg', duration = 3500) {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = { join: '🟢', leave: '🔴', msg: '💬' };
  toast.innerHTML = `<span>${icons[type] || '💬'}</span><span>${message}</span>`;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, duration);
}

// =============================================
//  USER LIST RENDERING
// =============================================

function renderUserList(users) {
  userList.innerHTML = '';
  const others = users.filter(u => u.id !== myId);
  userCount.textContent = others.length;

  if (others.length === 0) {
    const empty = document.createElement('li');
    empty.style.cssText = 'text-align:center;color:var(--color-text-muted);font-size:13px;padding:20px 0;';
    empty.textContent = 'Chưa có ai online';
    userList.appendChild(empty);
    return;
  }

  others.forEach(user => {
    const li = document.createElement('li');
    li.className = 'user-item' + (chatWith && chatWith.id === user.id ? ' active' : '');
    li.dataset.userId = user.id;

    const unread = unreadCounts[user.id] || 0;
    li.innerHTML = `
      <div class="avatar" style="background:${generateColor(user.username)}">${getInitial(user.username)}</div>
      <div class="user-item-info">
        <div class="user-item-name">${escapeHtml(user.username)}</div>
        <div class="user-item-status">● Online</div>
      </div>
      ${unread > 0 ? `<div class="unread-badge">${unread}</div>` : ''}
    `;

    li.addEventListener('click', () => openChat(user));
    userList.appendChild(li);
  });
}

// =============================================
//  CHAT WINDOW
// =============================================

function openChat(user) {
  chatWith = user;
  unreadCounts[user.id] = 0;

  // Update header
  chatAvatar.textContent    = getInitial(user.username);
  chatAvatar.style.background = generateColor(user.username);
  chatUsername.textContent  = user.username;

  // Show chat window
  noChatDiv.classList.add('hidden');
  chatWindow.classList.remove('hidden');

  // Render history
  renderMessages(user.id);
  messageInput.focus();

  // Update user list active state
  document.querySelectorAll('.user-item').forEach(li => {
    li.classList.toggle('active', li.dataset.userId === user.id);
    // Remove unread badge if present
    if (li.dataset.userId === user.id) {
      const badge = li.querySelector('.unread-badge');
      if (badge) badge.remove();
    }
  });
}

function closeChat() {
  chatWith = null;
  chatWindow.classList.add('hidden');
  noChatDiv.classList.remove('hidden');
  document.querySelectorAll('.user-item').forEach(li => li.classList.remove('active'));
}

function renderMessages(userId) {
  messagesContainer.innerHTML = '';
  const history = chatHistory[userId] || [];

  if (history.length === 0) {
    const sys = document.createElement('div');
    sys.className = 'system-msg';
    sys.textContent = 'Bắt đầu cuộc trò chuyện với ' + (chatWith ? escapeHtml(chatWith.username) : '');
    messagesContainer.appendChild(sys);
    return;
  }

  history.forEach(msg => appendMessageBubble(msg, false));
  scrollToBottom();
}

function appendMessageBubble(msg, scroll = true) {
  const isOutgoing = msg.sender.id === myId;
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${isOutgoing ? 'outgoing' : 'incoming'}`;

  bubble.innerHTML = `
    ${!isOutgoing ? `<div class="bubble-sender">${escapeHtml(msg.sender.username)}</div>` : ''}
    <div class="bubble-content">${escapeHtml(msg.message)}</div>
    <div class="bubble-time">${formatTime(msg.time)}</div>
  `;

  messagesContainer.appendChild(bubble);
  if (scroll) scrollToBottom();
}

function scrollToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// =============================================
//  SAFE HTML
// =============================================

function escapeHtml(text) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return String(text).replace(/[&<>"']/g, m => map[m]);
}

// =============================================
//  SOCKET.IO EVENTS
// =============================================

// ---- Join success ----
socket.on('join:success', ({ username, id, users }) => {
  myId       = id;
  myUsername = username;

  myNameDisplay.textContent = username;
  myAvatar.textContent      = getInitial(username);
  myAvatar.style.background = generateColor(username);

  loginScreen.classList.remove('active');
  chatScreen.classList.add('active');

  renderUserList(users);
});

// ---- Join error ----
socket.on('join:error', (msg) => {
  showError(msg);
  document.getElementById('join-btn').disabled = false;
});

// ---- New user came online ----
socket.on('user:online', ({ user, users }) => {
  renderUserList(users);
  showToast(`${user.username} vừa tham gia`, 'join');
});

// ---- User went offline ----
socket.on('user:offline', ({ userId, users }) => {
  const username = getUsernameById(userId);
  renderUserList(users);
  if (username) showToast(`${username} đã rời đi`, 'leave');

  // Close chat if we're chatting with that user
  if (chatWith && chatWith.id === userId) {
    const sys = document.createElement('div');
    sys.className = 'system-msg';
    sys.textContent = `${username} đã ngắt kết nối`;
    messagesContainer.appendChild(sys);
    scrollToBottom();
    chatWith = null;
    setTimeout(closeChat, 2500);
  }
});

// ---- Receive message (from other person) ----
socket.on('message:receive', (msg) => {
  const senderId = msg.sender.id;

  if (!chatHistory[senderId]) chatHistory[senderId] = [];
  chatHistory[senderId].push(msg);

  if (chatWith && chatWith.id === senderId) {
    // Chat is open — append directly
    appendMessageBubble(msg, true);
  } else {
    // Chat is not open — increment unread badge
    unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1;
    showToast(`${msg.sender.username}: ${msg.message.substring(0, 40)}...`, 'msg');
    // Update unread badge in sidebar
    const li = document.querySelector(`.user-item[data-user-id="${senderId}"]`);
    if (li) {
      let badge = li.querySelector('.unread-badge');
      if (!badge) {
        badge = document.createElement('div');
        badge.className = 'unread-badge';
        li.appendChild(badge);
      }
      badge.textContent = unreadCounts[senderId];
    }
  }
});

// ---- Message sent confirmation ----
socket.on('message:sent', (msg) => {
  const receiverId = msg.receiver.id;
  if (!chatHistory[receiverId]) chatHistory[receiverId] = [];
  chatHistory[receiverId].push(msg);

  if (chatWith && chatWith.id === receiverId) {
    appendMessageBubble(msg, true);
  }
});

// =============================================
//  HELPER: get username by id from DOM
// =============================================

function getUsernameById(id) {
  const li = document.querySelector(`.user-item[data-user-id="${id}"]`);
  if (li) return li.querySelector('.user-item-name')?.textContent || null;
  if (chatWith && chatWith.id === id) return chatWith.username;
  return null;
}

// =============================================
//  EVENT LISTENERS
// =============================================

// Join form submit
joinForm.addEventListener('submit', (e) => {
  e.preventDefault();
  hideError();
  const name = usernameInput.value.trim();
  if (!name) {
    showError('Vui lòng nhập tên của bạn.');
    return;
  }
  document.getElementById('join-btn').disabled = true;
  socket.emit('user:join', name);
});

// Allow re-enabling join button if user edits input after error
usernameInput.addEventListener('input', () => {
  hideError();
  document.getElementById('join-btn').disabled = false;
});

// Send message
messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msg = messageInput.value.trim();
  if (!msg || !chatWith) return;

  socket.emit('message:private', {
    receiverId: chatWith.id,
    message: msg,
  });

  messageInput.value = '';
  messageInput.focus();
});

// Close chat
closeChatBtn.addEventListener('click', closeChat);

// Logout
logoutBtn.addEventListener('click', () => {
  socket.disconnect();
  chatScreen.classList.remove('active');
  loginScreen.classList.add('active');
  usernameInput.value = '';
  myId = null;
  myUsername = null;
  chatWith = null;
  Object.keys(chatHistory).forEach(k => delete chatHistory[k]);
  Object.keys(unreadCounts).forEach(k => delete unreadCounts[k]);
  // Reconnect socket for future join
  socket.connect();
});

// Auto-focus username input when login screen is shown
usernameInput.focus();
