var socket = io();
socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('disconnect',() => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) => {
    console.log('newMessage', message);
    var li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);

    jQuery('#messages').append(li);
});



socket.on('newLocationMessage', (message) => {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_black">My current location</a>');

  li.text(`${message.from}:`);
  a.attr('href', message.url);
  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage',{
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {
      jQuery('[name=message]').val('');
  });
});

var locationButton = jQuery('#sendlocation');
locationButton.on('click',() => {
  if(!navigator.geolocation){
    return alert('Geolocation not support by your browser,');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location..,');
  navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('Send location');
    //console.log(position);
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, () => {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
