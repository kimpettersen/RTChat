$(document).ready(function() {
    var socket = io.connect();

$('#chatWindow').append('<a href="#">HIme</a>');

    //set focus to message-box
    $('#message-box').focus();
    
    //The main connection socket
    socket.on('connect', function() {

        //Set username if it doesn't exist
        if (!username){
        var username = prompt("Please enter your username","Username");
        socket.emit('RTUsers', {
            'username' : username
            });
        }

        //Set the div's we are using as variables
        var chat = $('#chatWindow');
        var usr = $('#users');

        //Append a message that confirm the connection
        chat.append('<em>Connected</em><br/>');

        //Listen on RTUsers and keep logged in users up to data
        socket.on('RTUsers', function(data){
            //Set local variables
            var allUsers = data.allUsers;
            //Better to open a new connection for this? What is faster? When does socket io communicated?
            for (i in allUsers) {
                usr.append('<p>' + allUsers[i] + '</p>'); 
            }
        });
        
        //Listen to messages and updates chatWindo      1   3q
        socket.on('RTMessage', function(data) {
                var message = data.message;
                var user = data.user;
                //Append who sent the message and what it was.
                chat.append('<p><b>' + user + ': </b>' + message + '</p>').animate({
                    scrollTop: chat.get(0).scrollHeight
                    }, 10);
            });
        
    $('#message-box').keypress(function(e) {
        if (e.keyCode == 13){// || e.keyCode == 108) {
            var msg = $(this).val();
            res = {
                    'message' : msg,
                    'user' : username
            };
            socket.emit('RTMessage', res);
            $(this).val('');
        }
    });
  });
});