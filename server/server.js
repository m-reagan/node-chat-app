const path = require('path');
const http = require('http');

const express = require ('express');
const socketIO = require('socket.io');

var port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);

var io = socketIO(server);

io.on('connection', (socket) => {
  console.log('New User connection');

  socket.on('disconnect', () => {
      console.log('disconnect event in server');
  });

});
app.use(express.static(path.join(__dirname, '..', 'public')));

server.listen(port,  () => {
  console.log(`Server started successfully at port ${port}`);
});
