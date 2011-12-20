var ChatWindow = new function() {
    //Empty all children of the container elem
    var emptyContainer = function() {
        
    };

    var createChatWindow = function() {

        var users = '<section id="user-list">this is a user list</section>';
        var chat = '<section class="chat-area" id="chat-area"></section>';
        var messageBox = '<section class="message-area" id="message-area">\
                            <input type="text" id="message-box"/>\
                            <button id="message-button">Send</button>\
                        </section>';
        var shareArea = '<section id="share-area">\
                            <button id="share-button">Share</button>\
                        </section>';

        $('#container').append(users,chat, messageBox, shareArea);
        $('html').addClass('fullSize');
    };
        
    //Initialize a chat window with clearing old container and building chat
    this.init = function() {
        emptyContainer();
        createChatWindow();
    };
};

$(document).ready(function() {
    var chatButton = document.getElementById('chatButton');
        chatButton.addEventListener('click', function(){
            
        }, false);
/*
    //For changeing the colors on Hover
    $('#chatButton').hover(
        function(){
            $(this).addClass('chatButtonHover');
          },
        function () {
            $(this).removeClass('chatButtonHover');
          }
        );
*/
});