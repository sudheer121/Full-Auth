var expdate = new Date();
expdate.setDate(expdate.getDate() + 7);
const loginPage = SITE_NAME + "/login";

function validateForm() {
    /*
    Damn this was hectic 
    */
    var errorCount = 0; 
    var fields = ['first_name','last_name','email','password','confirm_password'];
    var a = $('#email').val(); 
    var b = $('#password').val(); 
    var c = $('#confirm_password').val(); 
    fields.forEach(function(el) {
        var x = $("#" + el).val(); 
        if (x === null || x === "") {
            if(fields.indexOf(el) < 3) {
                $("#" + "email_error").html("Above field(s) can't be empty");
                $("#email").css({"margin-bottom":"0px"});
            } else { 
                var s = '#' + el; 
                $("#" + el + "_error").html("This field can't be empty");
                $(s).css({"margin-bottom":"0px"}); 
            }
            ++errorCount;
        }  else   { 
            $("#" + el + "_error").html(""); 
            $("#" + el).css({"margin-bottom":"10px"}); 
        }
    });

    regex = /\S+@\S+\.\S+/;
    if(a!=null && a.length!=0 && !regex.test(a)) {
        $('#email_error').html("Please enter a valid email");
        $("#email").css({"margin-bottom":"0px"});
        ++errorCount;
    } 
    if(b!=null && b.length!=0 && b.length < 8) {
        $('#password_error').html("Password too small, should be atleast 8 characters long");
        $("#password").css({"margin-bottom":"0px"});
        ++errorCount;
    } 
    if(c.length>0 && b!=c) {
        $('#confirm_password_error').html("Passwords don't match");
        $("#confirm_password").css({"margin-bottom":"0px"});
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
            url: SITE_NAME + '/api/register',  
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