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

var users = []

//Sockets
var simple = io
  .sockets
  .on('connection', function(socket) {
    //Handle username
    socket.on('username', function(data) {
        name = data
        for (i in users) {
            if (name === users[i]) {
                socket.emit('userStatus', {userStatus: false})
                name = false;
            }
        }
        if (name) {
            users.push(data);
            console.log('Users logged in: ' + users);
            socket.emit('userStatus', { userStatus : true });
        }
    });
    
    //All users
    socket.emit('allUsers', users);
    console.log('Sent list of logged in users: ' + users );
    
    //The messages
    socket.on('message', function(data) {
      console.log('Received data: ' + data)
      socket.emit('message', {
         message : { 'message' : data.msg, 
                    'username' : data.username
                    }
         
      });
      
      //Broadcast message to everyone
      socket.broadcast.emit('message', {
          message : { 'message' : data.msg, 
                     'username' : data.username
                     }
      });
    });
    
    socket.on('disconnect', function() {
      // handle disconnect
    });
  });

// Routes

app.get('/', function(req, res){
    res.render('index', {
       title : 'RealTime Chat' 
    });
});

app.get('/chat', function(req, res){
    /*
    1. Create unique ID
    2. Create a chat session
    3. Save Session in Redis
    4. Redirect to right chat
    */
    res.render('chat', {
       title : 'RealTime Chat' 
    });
});

app.get('/chat/:id', function(req, res){
    /*
    1. if session
            get session
        else
            create session
    2. render a chat window with the right session
    */
});

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
