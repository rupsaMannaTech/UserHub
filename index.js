const { faker } = require('@faker-js/faker');
const mysql     = require('mysql2');
const express=require("express");
const app= express();
const path=require("path");
const methodOverride=require("method-override");
const{v4:uuidv4}=require('uuid');

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'Rupsa@123',
  database : 'sigma_app'
});

let getRandomUser=() =>{
  return [
     faker.string.uuid(),
    faker.internet.username(),
     faker.internet.email(),
    faker.internet.password(),
];
}

//inserting new data
// let q="INSERT INTO user(id, username, email, password) VALUES ?";
// let users=[
//   ["123d", "123_newuserd", "abcd@gamil.comb", "abcdd"],
//   ["123e", "123_newusere", "abce@gamil.comc", "abcde"]
// ];

// let data=[];
// for(let i=1; i<=100; i++){
//   data.push(getRandomUser()); //100 fake users data
// // }

app.get("/",(req,res)=>{
  let q= `SELECT count(*) FROM user;`
  try{
connection.query(q, (err,result)=>{
    if (err) throw err;
    let count= result[0]["count(*)"];
    res.render("home.ejs",{count});
});}
catch(err){
    console.log(err);
    res.send("Some error in Data Base");
}
});


//show routes
app.get("/user",(req,res)=>{
  let q=`SELECT * FROM user`;
  // try{
connection.query(q, (err,users)=>{
    if (err) throw err;
    // console.log(result);
    res.render("showusers.ejs",{users});

});
// catch(err){
//     console.log(err);
//     res.send("Some error in Data Base");
// }
});

//edit route
app.get("/user/:id/edit",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  
  connection.query(q, (err,result)=>{
    if (err) throw err;
    let user=(result[0]);
    res.render("edit.ejs",{user});
});
});

//update (database) route
app.patch("/user/:id",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  let{password:formPass, username:newUser}=req.body;
  
  connection.query(q, (err,result)=>{
    if (err) throw err;
    let user=(result[0]);
    if(formPass!=user.password){
      res.send("WRONG PASSWORD");
    }
    else{
      let q2=`UPDATE user SET username='${newUser}' WHERE id='${id}'`;
      connection.query(q2, (err,result)=>{
      if (err) throw err; 
      res.redirect("/user");
      });
    }
});
});

//delete
  app.get("/user/:id/delete",(req,res)=>{
  let {id}=req.params;
  let q=`SELECT * FROM user WHERE id='${id}'`;
  
  connection.query(q, (err,result)=>{
    if (err) throw err;
    let user=(result[0]);
    res.render("delete.ejs",{user});
  });
  });
  //Updated deleted databse
  app.delete("/user/:id",(req,res)=>{
    let {id}=req.params;
    let q=`SELECT * FROM user WHERE id='${id}'`;
    
    connection.query(q, [id],(err,result)=>{
      if (err) throw err;
      if(result.length===0){
      return res.send("user not found");
    }
    let user=(result[0]);
      let{password:formPass, email:userEmail}=req.body;
    if(formPass!==user.password || userEmail!==user.email){
      return res.send("WRONG EMAIL & PASSWORD");
    }
    else{
      let q3=`DELETE FROM user WHERE id='${id}'`;
      connection.query(q3, [id],(err,result)=>{
      if (err) throw err; 
      res.redirect("/user");
      });}
});
});

//Add new user id
app.get("/user/:id/add",(req,res)=>{ //serve the form of adding userid
  res.render("addUserId.ejs",{user});
});

app.post("/user",(req,res)=>{ //receive the data 
  let {id, username, email,password}=req.body; //sent the data into server, placing it on request body
  let content=uuidv4(); 
  let q4= "INSERT INTO user(id, username, email, password) VALUES (?,?,?,?)";
  connection.query(q4,[id,username,email,password],(err,result)=>{
    if (err) throw err;
  res.redirect("/user"); //redirecting the file
});
});
app.get("/user",(req,res)=>{
let q= `SELECT * FROM user`;
  connection.query(q,(err,result)=>{
    if (err) throw err;
    let user=(result[0]);
    res.render("showusers.ejs");
  });
  });

// connection.end();

app.listen("8080",()=>{
  console.log("Server is listening on port 8080");
});
