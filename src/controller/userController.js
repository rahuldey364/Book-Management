const userModel = require("../models/userModel")
const validator = require("email-validator");
//const { findOne } = require("../models/collegeModel");
const jwt = require("jsonwebtoken")


const isvalid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.trim().length === 0) return false;
  return true;
};

const isvalidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
}

let createUser = async function (req, res) {
  try {

    let requiredBody = req.body;

    if (!isvalidRequestBody(requiredBody)) {
      return res.send({ status: false, msg: "please provide  details" })
    }

    let { title, name, email, password, phone, address } = req.body

    if (!isvalid(title)) {
      return res.status(400).send({ status: false, msg: "title is required" })
    }

    if (["Mr", "Mrs", "Miss","Mast"].indexOf(title) == -1) { return res.status(400).send({ status: false, message: "title should be Mr,Miss,Mrs" }) }


    if (!isvalid(name)) {
      return res.status(400).send({ status: false, msg: "Name is required" })

    }
     if (!isvalid(email)) {
      return res.status(400).send({ status: false, msg: "Email is required" })
    }

    if (address) {
      let check = Object.values(address)
      if (check.length > 0) {
        for (let i = 0; i < check.length; i++) {
          if (!isvalid(check[i])) { return res.status(400).send({ status: false, msg: "address is not valid" }) }
        }
      }
    }



    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    if (!pattern.test(password)) {
      return res.status(400).send({ status: false, msg: "password is not valid" })
    }

    let pattern1 = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/
    if (!pattern1.test(phone)) {
      return res.status(400).send({ status: false, msg: "Mobile Number is not valid" })
    }



    let validEmailFormat = await validator.validate(email);
    if (!validEmailFormat) {
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    }


    let validEmail = await userModel.findOne({ email :email });
    if (validEmail) {
      return res.status(409).send({ status: false, msg: "Email Alrady Exist" });
    }



    let validNumber = await userModel.findOne({ phone: phone });
    if (validNumber) {
      return res.status(409).send({ status: false, msg: "phone Number Alrady Exist" });   // 409 for duplication
    }



    let userData = await userModel.create(req.body)
    return res.status(201).send({ status: true, data: userData })
  } 
  catch (err) {
    return res.status(500).send({ err: err.message })

  }
}






const userLogIn = async function (req, res) {

  let data1 = req.body.email;
  let data2 = req.body.password;

  if (!data1) { return res.status(400).send({ status: false, message: "email is required" }) }

  if (!data2) { return res.status(400).send({ status: false, message: "password is required" }) }

  let checkData = await userModel.findOne({ email: data1, password: data2 });
  
  if (!checkData) {
      res.status(404).send({ status: false, msg: 'Invalid Credential' });
  }
  else {
    // var token = jwt.sign({email_id:'123@gmail.com'}, "Stack", {
//   expiresIn: '24h' // expires in 24 hours
//    });

      let token = jwt.sign({ userId: checkData._id }, "functionUp",{expiresIn: '120s'});
      let date = new Date()
      res.setHeader("x-api-key",token);
      // res.setHeader("x-userId",checkData._id)
      res.status(200).send({status:true,data:"logged in successfully", token : {token , date}})
      
  }
}


module.exports = { createUser, userLogIn }