const client_id_ = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com';

function onSuccess(googleUser) {
        var id_token_ = googleUser.getAuthResponse().id_token;
        var profile = googleUser.getBasicProfile();
        /*
        console.log('ID: ' + profile.getId());
        console.log('Full Name: ' + profile.getName());
        console.log('Given Name: ' + profile.getGivenName());
        console.log('Family Name: ' + profile.getFamilyName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        */
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
    console.log('User signed out of google.');
    });
}