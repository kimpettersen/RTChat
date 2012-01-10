/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
//var RedisStore = require('connect-redis')(express);
var app = require('express').createServer();
var io = require('socket.io').listen(app);
//var redis = require("redis");
//var db = redis.createClient();
var updateList = [];

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.cookieParser());
  //app.use(express.bodyParser());
  //app.use(express.session({ secret: 'cnkas0wfh83js RTChat', store: new RedisStore }));
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
          user = user.user
          //Makes it possible to join different chat rooms
          socket.join(room);
          callback({msg: 'Welcome to <i>' + room + '</i>, <b>' + user + '</b>'});
          console.log('Registered: ' + user + ' in ' + room);
          updateUsers();
      });

      function userExists(user) {
          for (i = 0; i < updateList.length; i++) {
              if (updateList[i] == user) {
                  return false;
              }
          }
          return true;
      }

      function updateUsers(){
          socket.emit('updateList', {});
          socket.broadcast.to(room).json.emit('updateList', {});
          updateList = [];
          registerOnlineUsers(updateList)
      };    
    
      function registerOnlineUsers(updateList){ 
            socket.on('update', function(data){
              //updateList.push( {'user' : data.user, 'room' : data.room } );
              user = data.user;
              addToList(user);
              socket.broadcast.to(room).json.emit('allUsers', updateList);
              socket.emit('allUsers', updateList);            
          });          
          //socket.broadcast.to(room).json.emit('allUsers', updatedList);
          //socket.emit('allUsers', updatedList);
      };
      
     function addToList(user) {
          for (i = 0; i < updateList.length; i++){
              if (user == updateList[i]){
                continue;
              }
          }
          updateList.push(user);
      };
    
        //Handles all the messaged
        socket.on('message', function(data){
            console.log('Received a message: ' + data.message + ' from ' + data.user);
            //socket.emit('RTMessage', msg);
            socket.broadcast.to(room).json.send(data);
        });
        
        
        socket.on('disconnect', function(data){
            updateUsers();
        });
    });

// Routes
app.get('/', function(req, res){
    res.render('init', {
       title : 'RealTime Chat' 
    });
});

//Receives the name(id) of the chat
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

app.get('/test', function(req, res){
   req.session.test = 'Hello!';
   res.render('test', {'title' : 'title'}); 
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);