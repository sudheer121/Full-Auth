<h2>  <h2>
  
<div align="center">
<img src="https://i.imgur.com/Ves9CKQ.png" width="150" height="150"/>
</div>

<h3> About </h3> 

  > This is an auth module built with nodejs.It's currently delployed here.The code is modularized and will be helpful for anyone looking into exploring the below mentioned technologies, learning OAuth or MVC architecture in nodejs.  
  > Have a look at https://full-auth.herokuapp.com.
  
<h3> Tech Stack / Tools <h3>
  <img alt="Nodejs" src="https://img.shields.io/badge/Nodejs-brigthgreen?style=plastic&logo=Node.js" />
  <br>
  <img alt="jQuery" src="https://img.shields.io/badge/jQuery-orange?style=plastic&logo=jQuery" />
  <img alt="jQuery" src="https://img.shields.io/badge/Ejs-orange?style=plastic" />
  <img alt="Express" src="https://img.shields.io/badge/Express-orange?style=plastic" />
  <br>
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-grey?style=plastic&logo=SQLite" />
  <img alt="MySQL" src="https://img.shields.io/badge/MySQL-grey?style=plastic&logo=MySQL" />
  
<h3> Features <h3>

> <ul> 
> <li> Authentication and authorization using JWT tokens. </li> 
> <li> Google and Facebook Sign In. </li>
> <li> Uses server side cookies </li>
> <li> Saves data in SQLite database </li> 
> <li> Model - View - Controller Architecture </li> 
> <li> Responsive </li>
> </ul>

<h3> To setup locally <h3>
  
```

git clone https://github.com/Sudheer121/Full-Auth.git
npm install 
node dbrunonce.js (sets up SQLite database)
  
```
> Change filename .env.example to .env 
<hr> 

<h3> More Details </h3> 

<h4> Database Tables <h4> 
  
> registration(uid, email, first_name, last_name, phone_no, signin_type)
> transactions(uid, pname, pid, pprice, tdate, ttime)
  
<h4> Api Routes </h4> 
 
 ```
 / 
 /login
 /register
 /api/gsignin
 /api/fbsignin
 /api/pay
 
 ```
