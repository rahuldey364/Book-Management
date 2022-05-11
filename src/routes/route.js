const express = require('express');
const router = express.Router();

const UserController = require("../controller/userController")
const BookController = require("../controller/bookController")
const ReivewController = require("../controller/reviewController")
const Middleware = require("../middleware/authMiddleware")






router.post("/register", UserController.createUser)

router.post("/login",UserController. userLogIn)

router.post("/books",BookController.createBook)

router.get("/books",BookController.getBooks)

router.get("/books/:bookId",Middleware.authentication,BookController.getBookById)

router.put("/books/:bookId",BookController.updateBooks)

router.delete("/books/:bookId",BookController.deleteBooksbyId)

router.post("/books/:bookId/review",ReivewController.createReview)

router.put("/books/:bookId/review/:reviewId",ReivewController.updateReview)

router.delete("/books/:bookId/review/:reviewId",ReivewController.deleteBooksbyId)



module.exports = router;