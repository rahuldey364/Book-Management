const booksModel = require("../models/booksModel")
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
      req.decodedToken = decodedToken;
  
  
    //   if (!decodedToken) return res.status(401).send({ status: false, msg: "Token is incorrect" });  // mark this
  
      next();                                                               //if token is correct then next function will be called respectively
    }
    catch (err) {
        console.log(err)
      res.status(401).send({ status: false, msg: err.message });
    }
  }




  
  let authorization = async function (req, res, next) {
    try {
      decodedToken = req.decodedToken;
      bookId = req.params.bookId;
      const isvalidId = await booksModel.findOne({_id:bookId,isDeleted:false});
      if (!isvalidId) {
        return res
          .status(401)
          .send({ status: false, data: "Please enter a valid bookId" });
      }
      // console.log(isvalidId);
      let userToBeModified = isvalidId.userId.toString();
      let userLoggedin = decodedToken.userId;
      if (userToBeModified !== userLoggedin) {
        return res
          .status(403)
          .send({
            status: false,
            data: "user logged is not allowed to modify the requested users data",
          });
      }
      next();
    } catch (err) {
      res.status(500).send({ status: false, data: err.message });
    }
  };  

  module.exports = {authentication , authorization}