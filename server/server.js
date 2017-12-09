const path = require('path');
const http = require('http');

const express = require ('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');

var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);

var io = socketIO(server);

io.on('connection', (socket) => {

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {
    console.log('Received Message');
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', function (message, callback) {
      console.log(`in createLocationMessage ${message.latitude}`);
      io.emit('newLocationMessage', generateLocationMessage('Admin', message.latitude, message.longitude));
      callback();
  });

  socket.on('disconnect', () => {
      console.log('disconnect event in server');
  });

});

app.use(express.static(path.join(__dirname, '..', 'public')));

server.listen(port,  () => {
  console.log(`Server started successfully at port ${port}`);
});
