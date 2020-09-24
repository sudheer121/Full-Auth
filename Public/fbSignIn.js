
window.fbAsyncInit = function() {
FB.init({
    appId      : '750362455545843',
    cookie     : true,
    xfbml      : true,
    version    : 'v8.0'
});
    
FB.AppEvents.logPageView();  

$("#fbsignin").bind("click",()=>{
    
    FB.login(function(response) {
    if (response.status === 'connected') {
        console.log(response); 
        $("#fbsignin span").html("<span><i class='fab fa-facebook-f'></i> Signed In");
    } else {
        console.log(response); 
    }
    }, {scope: 'public_profile,email'});

});
            
/*
function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
console.log('statusChangeCallback');
console.log(response);                   // The current login status of the person.
if (response.status === 'connected') {   // Logged into your webpage and Facebook.
testAPI();  
} else {                                 // Not logged into your webpage or we are unable to tell.
document.getElementById('chill').innerHTML = 'Please log ' +
    'into this webpage.';
}
}

FB.Event.subscribe('xfbml.render', ()=>{
    FB.getLoginStatus(function(response) {   // See the onlogin handler
    statusChangeCallback(response);
    });
});
*/ 
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'))

var finished_rendering = function() {
    console.log("finished rendering plugins");
    // var spinner = document.getElementById("spinner");
    //spinner.removeAttribute("style");
    //spinner.removeChild(spinner.childNodes[0]);
}

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    console.log(response.id); 
    getUserInfo(response.id); 
    });
}
function getUserInfo(userId) {
    console.log("Here"); 
    FB.api(
    '/'+userId+'/?fields=id,name,email',
    'GET',
    {},
    function(response) {
        // Insert your code here
        // console.log(response);
        let email = response.email;
        console.log(email); 
        //loginViaEmail(email);
    }
    );
};

