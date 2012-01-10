/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var app = require('express').createServer();
var io = require('socket.io').listen(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//Sockets
var chat = io.sockets.on('connection', function(socket) {
      var room = '';

      //Listener that sets users and broadcasts a message to all the rooms
      socket.on('setUser', function(user, callback){
          room = user.room;
          user = user.user;
          socket.set('username', user);
          socket.join(room);
          updateUsers(room);
          
          
          //sends a callback with a welcome message
          callback(
                    {
                        msg: 'Welcome to <i>' + room + '</i>, <b>' + user + '</b>',
                    });
          console.log('Registered: ' + user + ' in ' + room);
      });
    
      //Broadcasts and emits an updated list of active users to all the clients
      var updateUsers = function(room) {
          var userList = [];
          var users = io.sockets.clients(room);
          //Gets the username attached to each socket
          for (i in users){
              users[i].get('username', function(err, res){
                  
                  //push the username to list of users
                  userList.push(res);
                  });
            }


            //result is a array of usernames
            res = { allUsers: userList };
            
            //Need to brascast and emit orelse socket.IO wont send to the user that sent the
            //update request
            socket.broadcast.to(room).json.emit('allUsers', res);
            socket.emit('allUsers', res);            
      }; 
    
        //Handles all the messaged
        socket.on('message', function(data){
            console.log('Received a message: ' + data.message + ' from ' + data.user);
            socket.broadcast.to(room).json.send(data);
        });        
        
        //Currently logs the socket ID for the disconnected user. May be used later if I wont to go 
        //away from in-memory storage of online users.
        socket.on('disconnect', function(data){
            console.log(socket.id + ' disconnected');
        });
    });

// Routes

//Loads the index page of the chat
app.get('/', function(req, res){
    res.render('init', {
       title : 'Create a chat' 
    });
});

//Receives the name of the chat
app.post('/init', function(req, res){
    console.log('Received data from init.jade: ' + req.body.chatName);
    res.redirect('/chat/' + req.body.chatName);
});

//returns the title of the chat which is basicly everything after: chat/
app.get(/^\/chat?(?:\/(\w+))?/, function(req, res){
    res.render('chat', {
       title : req.params[0]
    });
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);