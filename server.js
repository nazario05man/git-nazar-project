const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const sharedEditor = 'sharedEditor';
const editors = new Map();

app.use(express.static('public'));

// Наш попередній код
// ...

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

// ...


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
