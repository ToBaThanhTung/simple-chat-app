const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


io.on('connection', (socket) => {
  console.log('a new user connected');



  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createAt: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('a user was disconnected');
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log('server is up on ', port);
});
