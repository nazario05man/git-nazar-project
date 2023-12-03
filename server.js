const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const sharedEditor = 'sharedEditor';
const editors = new Map();

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
  let currentEditor = null;

  socket.on('enterPassword', (enteredPassword) => {
    if (enteredPassword && editors.has(enteredPassword)) {
      currentEditor = editors.get(enteredPassword);
    } else {
      currentEditor = socket.id;
      editors.set(enteredPassword, currentEditor);
    }
    socket.join(currentEditor);
    socket.emit('passwordCorrect', enteredPassword);
  });

  socket.on('updateCode', (code) => {
    io.to(currentEditor || sharedEditor).emit('codeUpdated', code);
  });
});

// Serve your index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
