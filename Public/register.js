var expdate = new Date();
expdate.setDate(expdate.getDate() + 7);
const loginPage = "http://localhost:3000/login";

function validateForm() {
    
    var errorCount = 0; 
    var fields = ['first_name','last_name','email','password','confirm_password'];
    var a = $('#email').val(); 
    var b = $('#password').val(); 
    var c = $('#confirm_password').val(); 
    fields.forEach(function(el) {
        console.log("#"+el); 
        var x = $("#" + el).val(); 
        console.log(x); 
        if (x === null || x === "") {
            $("#" + el + "_error").html("This field can't be empty");
            ++errorCount;
        }
        else  $("#" + el + "_error").html("");
    });

    regex = /\S+@\S+\.\S+/;
    if(a!=null && a.length!=0 && !regex.test(a)) {
        $('#email_error').html("Please enter a valid email");
        ++errorCount;
    } 
    if(b!=null && b.length!=0 && b.length < 8) {
        $('#password_error').html("Password too small, should be atleast 8 characters long");
        ++errorCount;
    } 
    if(c.length>0 && b!=c) {
        $('#confirm_password_error').html("Passwords don't match");
        ++errorCount;
    } 
    if (errorCount) return 0;
    return 1
}

/* Register */ 
$("#main_register").bind("click", function(){ 
    
    var flag = validateForm();
    console.log(flag); 
    if(flag === 1)
    {
        $.ajax({
            url: 'http://localhost:3000/api/register',  
            type: 'post',
            data: JSON.stringify({ 
              email: $('#email').val(),
              password: $('#password').val(),
              first_name: $('#first_name').val(),
              last_name: $('#last_name').val(),
              signin_type : 0 
            }),
            contentType: "application/json",
            dataType: 'json',
            success: function(jsonobj) {
              console.log(jsonobj);         
              if(jsonobj.success===1)
              { 
                  $('#register_error').html(jsonobj.message) ;     
                  window.location.replace(loginPage);
              } else {
                $('#register_error').html(jsonobj.message);
              }
            }
        }); 
    }
}); 

// Arranging some html according to screen width
function checkSmallDevice() {
    if( screen.width <= 500) {
        console.log("Here"); 
        $('#first_name_error').remove();
        $('#first_name').after('<span class="error"><p id="first_name_error"></p></span>');
        $('#last_name_error').remove();
        $('#last_name').after('<span class="error"><p id="last_name_error"></p></span>');
    }
    else {
        var x = $('#first_name_error').html(); 
        $('#first_name_error').remove();
        $('#last_name_error').before('<span class="error"><p id="first_name_error">' + x +'</p></span>');
    }
}
$(document).ready(checkSmallDevice); 
$(window).on('resize',checkSmallDevice);