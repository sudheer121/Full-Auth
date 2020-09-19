var expdate = new Date();
expdate.setDate(expdate.getDate() + 7);
const registerPage = "http://localhost:3000/register";

const client_id_ = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com';
function onSuccess(googleUser) {
//   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var id_token_ = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId());
    console.log('Full Name: ' + profile.getName());
    console.log('Given Name: ' + profile.getGivenName());
    console.log('Family Name: ' + profile.getFamilyName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail());
    $.ajax({
        url: 'http://localhost:3000/api/gsignin',  
        type: 'post',
        data: JSON.stringify({ 
            id_token : id_token_ , 
            client_id : client_id_
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function(json) {      
            console.log(json.message); 
            if(json.success===1){
                document.cookie = "grishmat=" + json.token + ";expires=" + expdate.toUTCString() + "; SameSite=Strict;"; //grishmat is jwt token 
            }
        }
    }); 
}
function onFailure(error) {
    console.log(error);
}
function renderButton() {
    gapi.signin2.render('my-signin2', {
    'scope': 'profile email',
    'width': 180,
    'height': 35,
    'longtitle': true,
    'theme': 'dark',
    'onsuccess': onSuccess,
    'onfailure': onFailure
    });
}
function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
    var expdate = new Date()
    expdate.setDate(expdate.getDate() - 1);
    document.cookie = "grishmat=" + ";expires=" + expdate.toUTCString() + "; "; //grishmat is jwt token 
}

function toggleResetPswd(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

$(()=>{
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
}) 

$('#btn-signup').bind("click",function(){
    window.location.replace(registerPage);
})


function validateForm() {

    var errorCount = 0; 
    var fields = ['email','password'];
    var a = $('#email').val(); 
    var b = $('#password').val(); 
    fields.forEach(function(el) {
        var x = $("#" + el).val(); 
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
        $('#password_error').html("Password is not valid");
        ++errorCount;
    } 
    if (errorCount) return 0;
    return 1
}

// logs in the user from nu 
$("#main_login").bind("click", function(){
    
    var x = validateForm();
    if(x===1) {
        
        $.ajax({
            url: 'http://localhost:3000/api/login',  
            type: 'post',
            data: JSON.stringify({ 
              email: $('#email').val(),
              password: $('#password').val(),
            }),
            contentType: "application/json",
            dataType: 'json',
            success: function(jsonobj) {        
              console.log(typeof(jsonobj.success));
              if(jsonobj.success===1)
              {   
                  signOut(); //signOut of google if signing in via other account  
                  $('#afterlogin').html("Logged in successfully") ;     
                  document.cookie = "grishmat=" + jsonobj.token + ";expires=" + expdate.toUTCString() + ";SameSite=Strict;"; //grishmat is jwt token 
                  var x = document.cookie;
                  console.log("Cookie :" + x);    
              } else {
                //console.log(jsonobj); 
                $('#afterlogin').hide().html(jsonobj.message).fadeIn(1000).delay(1000).fadeOut(1000) ;
              }
            }
        }); 
    }
    
});

