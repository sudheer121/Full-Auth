const client_id_ = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com';
var expdate = new Date()
expdate.setDate(expdate.getDate() + 7);

console.log(expdate); 
function onSuccess(googleUser) {
//   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var id_token_ = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    console.log("In success function running");
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
                document.cookie = "grishmat=" + json.token + ";expires=" + expdate.toUTCString() + ";"; //grishmat is jwt token 
                onHome(); // will be called twice, first on document load and second here 
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
    console.log("I am called"); 
}
function signOut() 
{
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    console.log('User signed out.');
    });
    var expdate = new Date()
    expdate.setDate(expdate.getDate() - 1);
    document.cookie = "grishmat=" + ";expires=" + expdate.toUTCString() + ";"; //grishmat is jwt token 
}
$("#my-signin2").hide(); 
  /*
    var x = getCookie('grishma'); 
    if( x === undefined || x === null || x === "") {
        signOut(); 
    }
    */

function getCookie(name) {
    let cookie = {};
    document.cookie.split(';').forEach(function(el) {
      let [k,v] = el.split('=');
      cookie[k.trim()] = v;
    })
    console.log("I got it " + cookie[name]);
    return cookie[name];
}
console.log(document.cookie); 

function onHome(){  //gets detail of user on homepage load; 
    $.ajax({
        url: 'http://localhost:3000/api/onhome',  
        type: 'get',
        headers: {
            "Authorization": "Bearer " + getCookie('grishmat')
        },
        contentType: "application/json",
        dataType: 'json',
        success: function(jsonobj) {
          //console.log("asds" + getCookie('grishmat') );
          console.log(jsonobj); 
          var arr = [ "", "via google signin", "via facebook sigin"]; 
          var stmt = "Logged in as "; 
          if(jsonobj.success === 1) {
            $(loggedInAs).html(stmt +jsonobj.data.first_name + " " + jsonobj.data.last_name + " " + arr[jsonobj.data.signin_type]);
          }
        }
    }); 
};

$(document).ready(function() {
    var x = getCookie('grishmat');
    if(x == undefined || x === null){  }
    else {
        onHome(); 
    }
});
