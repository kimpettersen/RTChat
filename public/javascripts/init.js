$(document).ready(function() {

    var button = $('#generate');
    var inputField = $('.initBox');
    inputField.focus();
    button.click(function(){
        var res = '';
        var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	
        for (i=0; i<36; i++){
            num = Math.floor(Math.random()*chars.length);
            res += chars.substring(num, num+1);
        }
        
        window.location = 'chat/' + res

    });
});