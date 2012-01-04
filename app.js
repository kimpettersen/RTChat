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
var allUsers = [];

var simple = io
  .sockets
  .on('connection', function(socket) {
      socket.on('RTUsers', function(data) {
   
          username = data.username;

          //temporary hack to add username to list if it is not in the list
          allUsers.push(username);

          //JSON containing username, list of all users and the messsage.
          res = {'username' : username,
                 'allUsers' : allUsers
          };
          
          socket.emit('RTUsers', res);
          console.log('Emited: ' + res)  
        });
    
        socket.on('RTMessage', function(data){
            var msg = {
                    'message' : data.message,
                    'user' : data.user
                }
            socket.emit('RTMessage', msg);
            socket.broadcast.emit('RTMessage', msg);
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



//Render the chat
app.get('/chat', function(req, res){
    res.render('chat', {
       title : 'RealTime Chat' 
    });
});

//New chat renderer, disabled right now
/*
app.get(/^\/chat?(?:\/(\w+))?/, function(req, res){
    res.render('chat', {
       title : req.params[0]
    });
});
*/

generateID = function() {

};

app.listen(8000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);