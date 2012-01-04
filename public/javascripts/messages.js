var currentChat = null;
var username;
var room;

$(document).ready(function() {
    //set focus to message-box
    $('#message-box').focus();

      //Set username if it doesn't exist
        if (currentChat === null){
        var username = prompt("Please enter your username","Username");
        var room = document.URL.split('chat/')[1];
        }
    
    currentChat = new Chat;
    currentChat.Connect(username, room);
    
    $('#message-box').keypress(function(e) {
        if (e.keyCode == 13){// || e.keyCode == 108) {
            var msg = $(this).val();
            $(this).val('');
            currentChat.Emit(msg)
            }
        });
});


function Chat(){
    this.socket = null;
    this.user = '';
    this.room = '';

    this.Connect = function(usr, chatRoom) {

        socket = io.connect();//url to server goes here
        user = usr;
        room = chatRoom;

        socket.on('connect', function() {
            //Set the div's we are using as variables
            var chatWindow = $('#chatWindow');
            var userWindow = $('#users');

            
            //Append a message that confirm the connection

            socket.emit('setUser', {'user' : user, 'room' : room }, function(res){
                chatWindow.append(res.msg);
            });

            socket.on("message", function(message){
                //fix this JQuery
                chatWindow.append('<p><b>' + message.user + ': </b>' + message.message + '</p>').animate({
                    scrollTop: chat.get(0).scrollHeight
                    }, 10);
                });

            //Listen on allUsers for a list of users
            socket.on('allUsers', function(data){
                //Set local variables
                var allUsers = data.allUsers;
                for (i in allUsers) {
                    userWindow.append('<p>' + allUsers[i] + '</p>'); 
                }
            });
        });
    };

    
    this.Emit = function(msg){
        socket.emit('message', { 'message' : msg, 'user' : user});
        
        var chatWindow = $('#chatWindow');
        chatWindow.append('<p><b>' + user + ': </b>' + msg + '</p>').animate({
            scrollTop: chat.get(0).scrollHeight
            }, 10);
            
    };
}