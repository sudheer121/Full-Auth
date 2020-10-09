const {
    create,
    getUsers,
    getUserById
} = require("./user.service")


const data = {
    email : "asdsdad",
    password : "sadasdasd",
    first_name : "Asdsds",
    last_name : "Asdd",
    phone_no : "asdsdsd",
    signin_type : 0 
}

create(data)
.then((res)=>{
    console.log(res); 
})
.catch((err)=>{
    console.log(err); 
});

getUsers()
.then((res)=>{
    console.log("its here"); 
    console.log(res); 
})
.catch((err)=>{
    console.log(err); 
});