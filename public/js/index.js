var socket = io();

socket.on ('connect', function () {
  console.log('connecting from client');
});

socket.on ('disconnect', function () {
  console.log('disconnection in client');
});

var messagesList = jQuery('#messages');

socket.on('newMessage', function (message) {
    console.log('New message received', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    messagesList.append(li);
});

socket.on('newLocationMessage', function (locMessage) {
    var li = jQuery('<li></li>');
    var a = jQuery('<a target=_blank>My Current Location</a>');

    li.text(`${locMessage.from}:`);
    a.attr('href', locMessage.url);

    li.append(a);
    messagesList.append(li);
});

jQuery('#message_form').on('submit', function(event) {
  event.preventDefault();
});

jQuery('#send_button').on('click', function(event) {
  console.log('in send button click');
  var messageTextbox = jQuery('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function () {
    messageTextbox.val('');
  });
});

var locationButton = jQuery('#sendLocation_button');

locationButton.on('click', function (event) {
  if(!navigator.geolocation){
    return alert('GeoLocation not supported by your browser');
  }

  locationButton.attr('disabled','disabled').text('Sending location');

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(`latitude ${position.coords.latitude}`);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, function (){
        locationButton.removeAttr('disabled').text('Send location');
    });
  });
});
