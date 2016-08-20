var name = getQueryVariable('name');
var room = getQueryVariable('room');

var socket = io();
jQuery('.room-title').text(room);


console.log(name + ' wants to join' + room);

socket.on('connect',function(){

console.log('user connected to the socket socket.io!');
socket.emit('joinRoom',{

     name:name,
     room:room
});

});

socket.on('message',function(message){
var momentTimestamp = moment.utc(message.timestamp);
var $messages= jQuery('.messages');
/*var $message =jQuery('<li class="list-group-item"></li>');*/

console.log('New Message:');
console.log(message.text);
// (.) is used for select the html class
//append us  for show the messages to the page 
$messages.append('<p><strong>'+message.name+ ' ' + momentTimestamp.local().format('h:mm:ss a') +'</strong></p>')
$messages.append('<p>'+ message.text +'</p>');
/*$messages.append($message);*/
});

// handles submitting of new message
//jQuery used as a selector

var $form =jQuery('#message-form');

//submit button function
$form.on('submit',function(event){

	event.preventDefault();

	socket.emit('message',{
	   name: name,
       text: $form.find('input[name=message]').val()
    });

    //hide the search bar typing message
    $form.find('input[name=message]').val('');
 });