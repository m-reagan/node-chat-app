const path = require('path');
const http = require('http');

const express = require ('express');
const socketIO = require('socket.io');

const {generateMessage,generateLocationMessage} = require('./utils/message');
const User = require('./utils/users');

var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);

var io = socketIO(server);

var users = new User  ();

io.on('connection', (socket) => {

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.on('joinRoom', (joinDetails, callback) => {
      var user = users.addUser(socket.id, joinDetails.name, joinDetails.room);
      if(user) {
        socket.join(user.room);
        socket.broadcast.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} joined`));
        io.to(user.room).emit('newUserList',users.getUserList(user.room));
        callback();
      }else {
        callback('Unable to join the room');
      }

  });

  socket.on('createMessage', (message, callback) => {
    console.log('Received Message');
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    callback();
  });

  socket.on('createLocationMessage', function (message, callback) {
      console.log(`in createLocationMessage ${message.latitude}`);
      var user = users.getUser(socket.id);
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.latitude, message.longitude));
      callback();
  });

  socket.on('disconnect', () => {
      var user = users.getUser(socket.id);
      socket.leave(user.room);
      users.removeUser(socket.id);
      io.to(user.room).emit('newUserList',users.getUserList(user.room));
      socket.broadcast.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} left`));
      console.log('disconnect event in server');
  });

});

app.use(express.static(path.join(__dirname, '..', 'public')));

server.listen(port,  () => {
  console.log(`Server started successfully at port ${port}`);
});
