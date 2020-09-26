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
*/