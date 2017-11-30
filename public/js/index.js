var socket = io();

socket.on ('connect', function () {
  console.log('connecting from client');
});

socket.on ('disconnect', function () {
  console.log('disconnection in client');
});
