var socket = io();

socket.on ('connect', function () {
  console.log('connecting from client');
  var joinDetails  = jQuery.deparam(window.location.search);
  socket.emit('joinRoom', joinDetails, function (error) {
    if(error){
      alert(error);
      window.location.href = '/';
    }
    console.log('Joined the room');
  })
});

socket.on('newUserList', function (userNames) {
    var users = jQuery('#users');
    
    var ol = jQuery('<ol></ol>');
    userNames.forEach(function (name) {
      var li = jQuery('<li></li>');
      ol.append(li.text(name));
    });
    users.html(ol);
});
socket.on ('disconnect', function () {
  console.log('disconnection in client');
});

function scrollToBottom () {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

var messagesList = jQuery('#messages');

socket.on('newMessage', function (message) {
    console.log('New message received', message);
    var formattedTime = moment(message.createdAt).format('hh:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      text: message.text,
      createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);

    // messagesList.append(li);
});

socket.on('newLocationMessage', function (locMessage) {
    var formattedTime = moment(locMessage.createdAt).format('hh:mm a');
    var template = jQuery('#location-message-template').html();
    var html = Mustache.render(template, {
      from: message.from,
      url: message.url,
      createdAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
    // var li = jQuery('<li></li>');
    // var a = jQuery('<a target=_blank>My Current Location</a>');

    // li.text(`${locMessage.from} ${formattedTime}:`);
    // a.attr('href', locMessage.url);

    // li.append(a);
    // messagesList.append(li);
});

jQuery('#message_form').on('submit', function(event) {
  event.preventDefault();
});

jQuery('#send_button').on('click', function(event) {
  console.log('in send button click');
  var messageTextbox = jQuery('[name=message]');
  var messageText = messageTextbox.val();
  if(messageText && messageText.trim().length > 0){
    socket.emit('createMessage', {
      text: messageText
    }, function () {
      messageTextbox.val('');
    });
  }
  
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
