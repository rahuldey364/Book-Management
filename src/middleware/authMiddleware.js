const booksModel = require("../models/booksModel")
const userModel = require("../models/userModel")
const reviewModel = require("../models/reviewModel")
const validation = require("../validation/validation")
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken');


const authentication = (req, res, next) => {
    try {
      let token = req.headers["x-Api-key"];                   //getting token from header
  
      if (!token) {                                          //if token is not present 
  
        token = req.headers["x-api-key"];                  //getting token from header
      }
      if (!token) {
  
        return res.status(401).send({ status: false, msg: "Token must be present" });
      }
      let decodedToken = jwt.verify(token, "function1Up");              //verifying token with secret key
  
  
    //   if (!decodedToken) return res.status(401).send({ status: false, msg: "Token is incorrect" });  // mark this
  
      next();                                                               //if token is correct then next function will be called respectively
    }
    catch (err) {
        console.log(err)
      res.status(401).send({ status: false, msg: err.message });
    }
  }




  
const authorization = async (req, res, next) => {
    try {
      let token = req.headers["x-Api-key"];
  
      token = req.headers["x-api-key"];
  
      let decodedToken = jwt.verify(token, "functionUp");
  
      let loggedInUser = decodedToken.userId;
  
      let userLogging;
  
      if (req.body.hasOwnProperty('userId')) {                            //if userId is present in request body
  
  
        if (!validation.isValidObjectId(req.body.userId))   return res.status(400).send({ status: false, msg: "Enter a valid userId" })
  
        userLogging = req.body.userId;
  
      }
  
      if (req.params.hasOwnProperty('bookId')) {
  
        if (!validation.isValidObjectId(req.params.bookId))  return res.status(400).send({ status: false, msg: "Enter a valid book Id" })
  
        let bookData = await booksModel.findById(req.params.bookId);
  
        if (!bookData)   return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });
  
        userLogging = bookData.userId.toString();
      }
  
      if (req.query.hasOwnProperty('userId')) {                             //if userId is present in request query
  
  
        if (!validation.isValidObjectId(req.query.userId))    return res.status(400).send({ status: false, msg: "Enter a valid user Id" })
  
        let bookData = await booksModel.findOne({ userId: req.query.userId });
  
        if (!bookData)  return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });
  
        userLogging = bookData.userId.toString();                         //getting userId from blog data using userId and converting it to string
      }
  
  
  
      if (!userLogging) return res.status(400).send({ status: false, msg: "userId is required" });
  
  
      if (loggedInUser !== userLogging) return res.status(403).send({ status: false, msg: "Error, authorization failed" });
      next();
    }
  
    catch (err) {
  
      res.status(500).send({ status: false, msg: err.message });
  
    }
  }
  

  module.exports = {authentication , authorization}