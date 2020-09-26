//const { get } = require("https");

window.fbAsyncInit = function() {
FB.init({
    appId      : '750362455545843',
    cookie     : true,
    xfbml      : true,
    version    : 'v8.0'
});
    
FB.AppEvents.logPageView();  

fbLoginStatus(); // automatic login try; 
/*
Continue here 
https://stackoverflow.com/questions/58325442/the-method-fb-getloginstatus-can-no-longer-be-called-from-http-pages
https://developers.facebook.com/community/threads/321473025465532/
*/
$("#fbsignin").bind("click",()=>{
    fbLogin(); 
});
            
};

(function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
   
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'))

/*
function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
    console.log('Successful login for: ' + response.name);
    console.log(response.id); 
    getUserInfo(response.id); 
    });
}
*/ 

function fbLogin() {

    FB.login(function(response) {
        //console.log(response);
        if (response.status === 'connected') {
            const userID = response.authResponse.userID;
            const accessToken = response.authResponse.accessToken;
            getUserInfo(userID,accessToken);
        } else {
            console.log("User couldn't log in to facebook"); 
        }
    }, {scope: 'public_profile,email'});
}

function getUserInfo(userId,accessToken) {
    FB.api(
    '/'+userId+'/?fields=id,name,email',
    'GET',
    {},
    function(response) {
        
        //response is an object with id, name and email, passing this as dataObject 
        console.log(response); 
        $.ajax({
            url: SITE_NAME + '/api/fbsignin',  // notice the s 
            type: 'post',
            data: JSON.stringify({ 
                accessToken : accessToken , 
                dataObject : response 
            }),
            contentType: "application/json",
            dataType: 'json',
            success: function(json) {      
                if(json.success === 1)
                {
                    $("#fbsignin span").html("<span><i class='fab fa-facebook-f'></i> Signed In");
                }
                console.log(json.message); 
            }
        }); 
    }
    );
};

// not using as of now 

function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
    console.log('statusChangeCallback');
    console.log(response);                   // The current login status of the person.
    if (response.status === 'connected') {   // Logged into your webpage and Facebook.
       getUserInfo(response.authResponse.userID,response.authResponse.accessToken);
    } else {                                 // Not logged into your webpage or we are unable to tell.
        console.log("User isn't signined in"); 
    }
}


function fbLoginStatus() {
    FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {   // Logged into your webpage and Facebook.
            statusChangeCallback(response);
          } 
    });
}

function fbLogout() {
    FB.logout(function(response) {
        console.log("Logged out of facebook")
     });
}
/*
On login -> fbLoginStatus -> statusChangecallback -> getUserinfo
On click -> fbLogin -> getUserInfo 
*/ 