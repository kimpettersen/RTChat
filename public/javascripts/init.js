$(document).ready(function() {
    var inputField = $('.initBox');
    inputField.focus();

   
});

function customForm(){
        var val = $('#initBox').val();
        if (val == '' || val == 'Chat name'){
            alert('Type in a chat name first.');
        }
        else {
            document.initForm.submit();
        }
   };

   function randomForm(){
       var res = '';
       var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	
       for (i=0; i<36; i++){
           num = Math.floor(Math.random()*chars.length);
           res += chars.substring(num, num+1);
       }
       
       window.location = 'chat/' + res;
   };