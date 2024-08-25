const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){ // True --> username already exits 
       res.status(400).json({message: "Username already exists! Please Login in"});
    }
    else{ // Create username and pass
     users.push({username:username, password:password});
     res.status(201).json({message:"User registered successfully!"});
    }
 }
 else{
  res.status(201).json({message:"Username or password is missing"});
 }
});


// Get the book list available in the shop
public_users.get('/',async (req, res) => {
    await res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const ISBN = req.params.isbn;
  const booksBasedOnIsbn = (ISBN) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const book = books[ISBN]; // Access the book using the ISBN as the key
              if (book) {
                  resolve(book);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  }

  booksBasedOnIsbn(ISBN).then((book) => {
      res.json(book);
  }).catch((err) => {
      res.status(400).json({ error: "Book not found" });
  });
});


// Get book details based on author -> using aync await
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;

  const booksBasedOnAuthor = async (auth) => {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const filteredBooks = Object.values(books).filter((b) => b.author === auth);
              if (filteredBooks.length > 0) {
                  resolve(filteredBooks);
              } else {
                  reject(new Error("Book not found"));
              }
          }, 1000);
      });
  };

  try {
    const booksByAuthor = await booksBasedOnAuthor(author); 
    res.json(booksByAuthor); // Respond with the resolved value
} catch (err) {
    res.status(400).json({ error: "Book not found" });
}
});


// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  
  let new_books = {}
  const re_title = req.params.title;
  let i = 1;
  for(bookid in books){
     if(books[bookid].title === re_title ){
       new_books[i++] = books[bookid]
      }
  }
  await res.send(JSON.stringify(new_books))
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
  const isbn = req.params.isbn;
  await res.send(JSON.stringify(books[isbn].review),null,4);
});

module.exports.general = public_users;
