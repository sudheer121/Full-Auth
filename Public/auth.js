
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
        url: 'http://localhost:3000/gsignin',  
        type: 'post',
        data: JSON.stringify({ 
            id_token : id_token_ , 
            client_id : client_id_
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function(json) {      
            console.log("Server: I have received id token: " + json); 
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
function toggleResetPswd(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle() // display:block or none
    $('#logreg-forms .form-reset').toggle() // display:block or none
}

function toggleSignUp(e){
    e.preventDefault();
    $('#logreg-forms .form-signin').toggle(); // display:block or none
    $('#logreg-forms .form-signup').toggle(); // display:block or none
}

$(()=>{
    // Login Register Form
    $('#logreg-forms #forgot_pswd').click(toggleResetPswd);
    $('#logreg-forms #cancel_reset').click(toggleResetPswd);
    $('#logreg-forms #btn-signup').click(toggleSignUp);
    $('#logreg-forms #cancel_signup').click(toggleSignUp);
})

$("#main_login").bind("click", function(){
    $.ajax({
        url: 'http://localhost:3000/api/login',  
        type: 'post',
        data: JSON.stringify({ 
          email: $('#inputEmail').val(),
          password: $('#inputPassword').val(),
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function(jsonobj) {        
          console.log(typeof(jsonobj.success));
          if(jsonobj.success===1)
          { 
              $('#afterlogin').html("Logged in successfully") ;     
              document.cookie = "grishmat="+jsonobj.token; //grishmat is jwt token 
              var x = document.cookie;
              console.log("Cookie :" + x);    
          } else {
            //console.log(jsonobj); 
            $('#afterlogin').html(jsonobj.message) ;
          }
        }
    }); 
});
