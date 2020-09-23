const client_id_ = '244496231967-2jf7lel0i19vb0uo8moaf63uet2e28ks.apps.googleusercontent.com';
var expdate = new Date()
expdate.setDate(expdate.getDate() + 7);

//Google signin 
function onSuccess(googleUser) {
//   console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
    var idtoken = googleUser.getAuthResponse().id_token;
    var profile = googleUser.getBasicProfile();
    $.ajax({
        url: 'http://localhost:3000/api/gsignin',  
        type: 'post',
        data: JSON.stringify({ 
            id_token : idtoken , 
            client_id : client_id_
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function(json) {      
            console.log(json.message); 
            if(json.success===1){
                document.cookie = "grishmat=" + json.token + ";expires=" + expdate.toUTCString() + ";SameSite=Strict;"; //grishmat is jwt token 
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
    else{
            onHome(); 
    }
});

$('#postpay').click(function(){
    var x = getCookie('grishmat');
    //var a = 
    //console.log($('#product_name').val + " " +  $('#product_id').val  + " " + $('#product_price').val); 
    $.ajax({
        url: 'http://localhost:3000/api/pay',
        type: 'post',
        data : JSON.stringify({
            product_name : $('#product_name').val(),
            product_id : $('#product_id').val(),
            product_price : $('#product_price').val()
        }),
        contentType: "application/json",
        dataType: 'json',
        headers : {
            "Authorization" : "Bearer " + x 
        },
        success : function(json) {
            $('#postpaymsg').hide().html("<pre style='color:green;'>Payment successful<pre>").fadeIn(1000).delay(1000).fadeOut(2000) ;
            console.log(json); 
        }  
    });
});
$('#getpay').click(function(){  //get history
    var x = getCookie('grishmat'); 
    if(x == undefined || x==null) return; 
    $.ajax({
        url: 'http://localhost:3000/api/pay',
        type: 'get',
        contentType: "application/json",
        dataType: 'json',
        headers : {
            "Authorization" : "Bearer " + x 
        },
        success : function(json) {
            console.log(json); 
            printDetails(json.data); 
        }
    });
});

function printDetails(resultArr){ 
    if(resultArr.length===0 || resultArr === undefined || resultArr === null) {
        $("#details").html("<p>No transactions so far</p>");
        return; 
    }
    $("#details").html("<table><tr><th> Time </th><th> Date </th><th> Product Name </th><th> Producut ID </th>  <th> Product Price</th></tr> </table>");
    var x = '<td>'; var y = '</td>';
    var str; 
    for(var i=0;i<resultArr.length;i++)
    {
        const obj = resultArr[i]; 
        str = x + obj.ttime + y; 
        str += x + obj.tdate + y; 
        str += x + obj.pname + y;
        str += x + obj.pid + y;
        str += x + obj.pprice + y; 
        str = '<tr>' + str + '</tr>'; 
        $("#details table").append(str); 
    }

}