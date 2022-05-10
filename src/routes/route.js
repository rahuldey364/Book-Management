const express = require('express');
const router = express.Router();

const UserController = require("../controller/userController")
const BookController = require("../controller/bookController")








router.post("/register", UserController.createUser)

router.post("/login",UserController. userLogIn)

router.post("/books",BookController.createBook)

router.get("/books",BookController.getBooks)

router.get("/books/:bookId",BookController.getBookById)

router.put("/books/:bookId",BookController.updateBooks)

router.delete("/books/:bookId",BookController.deleteBooksbyId)



module.exports = router;