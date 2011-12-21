$(document).ready(function() {
    var username = prompt("Please enter your username","Username");
    var socket = io.connect();

    socket.on('connect', function() {
        $('#chatWindow').append('<em>Connected</em><br/>');
        //Place for a callback??
        socket.emit('username', username);
        socket.on('userStatus', function(status){ 
           //Set the right username
            });
    });

    //set focus to message-box
    $('#message-box').focus();

/*
    socket.on('connect', function () {
      socket.emit('message', value);
    });

*/
    socket.on('allUsers', function(users){
        var usr = $('#users');
        for (i in users) {
            usr.append(users[i] + '<br />') 
        }
    });

    socket.on('message', function (msg) {
        //add element first
        if (msg === ''){
            //clear message box
        }
        else {
            var chat = $('#chatWindow')
            //Consider activating this
            //var message = prepareMsg(msg.message);
            chat.append('<b>' + msg.message.username + ': </b>' + msg.message.message + '<br>').animate({
                scrollTop: chat.get(0).scrollHeight
                }, 10);
            }
    });
    
    $('#message-box').keypress(function(e) {
        if (e.keyCode == 13){// || e.keyCode == 108) {
            var value = $(this).val();        
            socket.emit('message', {'msg' : value, 'username' : username });
            $(this).val('');
        }
    });
    
    
    /*
    //may be redundant
    var prepareMsg = function(msg) {
        //Fix words that are longer than 
        var splitted = msg.message.split('');
        
        var res = '';
        for (i = 0; i < splitted.length; i++){
            if ((i % 118) === 0 && i != 0) {
                res += '<br />'
            }
            res += splitted[i];
        }
        return res
    }
*/
});