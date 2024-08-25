const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  for(let user of users){
    if(user.username === username){
      return true;
    }
  }
  return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  if(username && password){
    for(let user of users){
      if(user.username === username && user.password === password){
        return true;
      }
    }
  }
  return false;
}

regd_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username && password){
       if(isValid(username)){ // True --> username already exits 
          res.status(400).json({message: "Username already exists! Please Login in"});
       }
       else{ // Create username and pass
        users.push({username:username, password:password});
        res.status(201).json({message:"User registered successfully!"});
       }
    }
});
//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(!authenticatedUser(username,password)){ // Not authenticated 
      return res.status(403).json({message:"User not authenticated"})
  }
   let accessToken = jwt.sign({ data:username}, 'access' , {expiresIn:60*60});
   req.session.authorization = { accessToken}
   res.send("User logged in Successfully")
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let user = req.session.username;
  let ISBN = req.params.isbn;
  let data = req.params.review;
  let rev = {user:user,review:data};
  books[ISBN].reviews = rev;
  return res.status(201).json({message:"Review added successfully"})
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  let ISBN = req.params.isbn;
  books[ISBN].reviews = {}
  return res.status(200).json({messsage:"Review has been deleted"})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
