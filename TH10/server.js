const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Store connected users: { socketId: { username, id } }
const onlineUsers = {};

io.on('connection', (socket) => {
  console.log(`[+] New connection: ${socket.id}`);

  // User joins with a username
  socket.on('user:join', (username) => {
    // Check if username already taken
    const isTaken = Object.values(onlineUsers).some(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (isTaken) {
      socket.emit('join:error', 'Tên người dùng đã được sử dụng. Vui lòng chọn tên khác.');
      return;
    }

    onlineUsers[socket.id] = { username, id: socket.id };
    socket.username = username;

    console.log(`[+] User joined: ${username} (${socket.id})`);

    // Notify the joining user
    socket.emit('join:success', {
      username,
      id: socket.id,
      users: Object.values(onlineUsers),
    });

    // Notify all others
    socket.broadcast.emit('user:online', {
      user: onlineUsers[socket.id],
      users: Object.values(onlineUsers),
    });
  });

  // Handle private message
  socket.on('message:private', ({ receiverId, message }) => {
    const sender = onlineUsers[socket.id];
    if (!sender) return;

    const payload = {
      sender: { username: sender.username, id: sender.id },
      receiver: { id: receiverId },
      message,
      time: new Date().toISOString(),
    };

    // Send to receiver
    io.to(receiverId).emit('message:receive', payload);

    // Echo back to sender (so it appears in their chat)
    socket.emit('message:sent', payload);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const user = onlineUsers[socket.id];
    if (user) {
      console.log(`[-] User disconnected: ${user.username} (${socket.id})`);
      delete onlineUsers[socket.id];

      // Notify all others
      io.emit('user:offline', {
        userId: socket.id,
        users: Object.values(onlineUsers),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Chat server running at http://localhost:${PORT}\n`);
});
