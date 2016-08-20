
var IP =  process.env.OPENSHIFT_NODEJS_IP;
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var express = require('express');
var moment = require('moment');
var app=express();
var http = require('http').Server(app);
/*this way to write socket.io*/
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

var clientInfo={};

io.on('connection',function(socket){
	console.log('user connected via socket.io');

//diconnect the room function
socket.on('disconnect',function(){
  if(typeof clientInfo[socket.id] !=='undefined'){
    socket.leave(clientInfo[socket.id].room);
    io.to(clientInfo[socket.id].room).emit('message',{
        name:'System',
        text:'oppss '+ clientInfo[socket.id].name + '  has left!!',
        timestamp:moment().valueOf()

    });
       delete clientInfo[socket.id];
  }
});


  //request o join  in room function
socket.on('joinRoom',function(req){

  clientInfo[socket.id]= req;

  socket.join(req.room);
  socket.broadcast.to(req.room).emit('message',{
      name:'System',
      text:req.name + ' has just join room!!',
      timestamp:moment().valueOf()

  });


});


	socket.on('message',function(message){
      console.log('Messsage recived:::' + message.text);
        //this code is gor show only recived messages
      //socket.broadcast.emit('message',message); 
      /*new*/
      //this code show send and recived messgaes
      //show time 
      message.timestamp = moment().valueOf();
      io.to(clientInfo[socket.id].room).emit('message',message);

	});

	 socket.emit('message',{
        name: 'System',
        text:'welcome to the chat application',
        timestamp:moment().valueOf()
    });
  });

http.listen(PORT,IP, function(){

console.log('Server started!');

});
