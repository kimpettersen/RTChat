/**
 * Module dependencies.
 */

var express = require('express')
var routes = require('./routes')
//var RedisStore = require('connect-redis')(express);
var app = require('express').createServer()
var io = require('socket.io').listen(app);


// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  //app.use(express.cookieParser());
  //app.use(express.bodyParser());
  //app.use(express.session({ secret: 'cnkas0wfh83js RTChat', store = new RedisStore }));
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
    console.log('Started a connection');
      var room = ''
      socket.on('setUser', function(user, callback){
          socket.join(user.room);
          room = user.room;
          user = user.user
          callback({msg: 'Welcome to <i>' + room + '</i>, <b>' + user + '</b>'});
          console.log('Registered: ' + user + ' in ' + room);
      });
      
      //handles the list of all users
      socket.on('allUsers', function(user) {
          console.log('Sent list of logged in users: ' + allUsers);
          socket.broadcast.to(room).send(allUsers);
        });
    
        //Handles all the messaged
        socket.on('message', function(data){
            console.log('Received a message: ' + data.message + ' from ' + data.user);

            //socket.emit('RTMessage', msg);
            socket.broadcast.to(room).json.send(data);
        });
    });

// Routes
//This one will be replaced later
app.get('/', function(req, res){
    res.render('index', {
       title : 'RealTime Chat' 
    });
});

//The new index route when that starts working
app.get('/init', function(req, res){
    res.render('init', {
       title : 'RealTime Chat' 
    });
});

//Receives the name(id) of the chat
app.post('/init', function(req, res){
    console.log('REceived data from init.jade: ' + req.body.chatName);
});

//Render the chat
app.get('/chat', function(req, res){
    res.render('chat', {
       title : 'RealTime Chat' 
    });
});

app.get(/^\/chat?(?:\/(\w+))?/, function(req, res){
    res.render('chat', {
       title : req.params[0]
    });
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);