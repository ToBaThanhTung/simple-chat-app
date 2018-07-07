var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessages = messages.children('li:last-child');

  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessages.innerHeight();
  var lastMessageHeight = newMessages.prev().innerHeight();
  if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight>= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  console.log('connected to server');
});

socket.on('disconnect',() => {
    console.log('disconnected from server');
});

socket.on('newMessage', (message) =>{
    var formattedTime = moment(message.createAt).format('h:mm a');
    var template = jQuery("#message-template").html();
    console.log('newMessage', message);
    var html = Mustache.render(template,{
      text: message.text,
      from: message.from,
      createAt: formattedTime
    });
    jQuery('#messages').append(html);
    scrollToBottom();
});



socket.on('newLocationMessage', (message) => {
  var formattedTime = moment(message.createAt).format('h:mm a');
  var template = jQuery("#message-location-template").html();
  var html = Mustache.render(template,{
    from: message.from,
    url: message.url,
    createAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
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
