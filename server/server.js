const http = require('http');
const path = require('path');
const publicPath = path.join(__dirname, '../public');
const express = require('express');
const port = process.env.PORT || 3000;
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utilts/message');
var app = express();
var server = http.createServer(app);
var io = socketIO(server);


io.on('connection', (socket) => {
  console.log('a new user connected');
  // admin send to new user
  socket.emit('newMessage', generateMessage('Admin', 'Wellcome'));
  // admin send to all old user
  socket.broadcast.emit('newMessage', generateMessage('Admin', 'new user comming!'));
  socket.on('createMessage', (message, callback) => {
    console.log('createMessage', message);
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('From server');
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('a user was disconnected');
  });
});

app.use(express.static(publicPath));

server.listen(port, () => {
  console.log('server is up on ', port);
});
