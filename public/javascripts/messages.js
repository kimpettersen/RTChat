var currentChat = null;
var username = '';
var room = '';

$(document).ready(function() {
    //set focus to message-box
    $('#message-box').focus();

      //Set username if it doesn't exist and set the room variable to be everything after: "/chat/"
      //in the current URL
        if (currentChat === null){
            var username = prompt("Please enter your username","Username");
            var room = document.URL.split('chat/')[1];
        }
    
    //create a new chat
    currentChat = new Chat;
    
    //Connct to the chat room with username
    currentChat.connect(username, room);
    
    //Listen to the input field in the chat and sends the written message to the server when "Return"
    //is pressed
    $('#message-box').keypress(function(e) {
        if (e.keyCode == 13){// || e.keyCode == 108) {
            var msg = $(this).val();
            $(this).val('');
            currentChat.emit(msg)
            }
        });
});

//Chat object
function Chat(){
    //Defines variables
    this.socket = null;
    this.user = '';
    this.room = '';

    //Connect function. Requires username and what room to connect to
    this.connect = function(usr, chatRoom) {

        //create a connection to the server
        socket = io.connect();//url to server goes here
        
        //Set local variables
        user = usr;
        room = chatRoom;

        //Create a connection socket
        socket.on('connect', function() {

            //Set the div's we are using as variables
            var chatWindow = $('#chatWindow');
            var userWindow = $('#userWindow');
            
            //Append a message that confirm the connection
            socket.emit('setUser', {'user' : user, 'room' : room }, function(res){
                chatWindow.empty().append(res.msg);
            });

            //Listener for all incomming messages. Appends them to chatWindow
            socket.on("message", function(message){
                //fix this JQuery
                chatWindow.append('<p><b>' + message.user + ': </b>' + message.message + '</p>').animate({
                    scrollTop: chat.get(0).scrollHeight
                    }, 10);
                });

            //Listen on allUsers for a list of users
            socket.on('allUsers', function(data){                
                //Set local variables
                var user = data.user;
                var allUsers = data.allUsers;

                //clear the old list of users
                userWindow.empty();
                //append the new ones
                for (i in allUsers) {
                    userWindow.append('<li>' + allUsers[i] + '</li>'); 
                }
            });
        });
    };

    //Function for sending a message
    this.emit = function(msg){
        //emit the message
        socket.emit('message', { 'message' : msg, 'user' : user});
        
        //Append the message locally right away
        var chatWindow = $('#chatWindow');
            chatWindow.append('<p><b>' + user + ': </b>' + msg + '</p>').animate({
            scrollTop: chat.get(0).scrollHeight
        }, 10);
    };
}