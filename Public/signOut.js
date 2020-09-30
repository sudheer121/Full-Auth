// signs out everything, makes life easy 

function realSignOut()
{
    fbLogout(); // inside fbSignin.js
    signOut();   // inside googleSignin.js
    var expdate = new Date()
    expdate.setDate(expdate.getDate() - 1);
    document.cookie = "grishmat=" + ";expires=" + expdate.toUTCString() + ";"; //grishmat is jwt token 

    console.log("Real Sign Out"); 
}
/*

Next task
Put realSignOut in google signin success function and facebook succes function 

See how to view client status without hiding google button in background 
Solutions :
1 -> https://stackoverflow.com/questions/38083568/how-to-check-if-user-is-logged-in-or-not-with-google-sign-in-oauth-2-0
2 -> https://stackoverflow.com/questions/47475663/using-google-sign-out-at-different-page

*/