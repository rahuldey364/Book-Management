const userModel = require("../models/userModel")
const validator = require("email-validator");
const validation = require("../validation/validation")
const jwt = require("jsonwebtoken")







let createUser = async function (req, res) {
  try {

    let requiredBody = req.body;
    let { title, name, email, password, phone, address } = req.body


    if (!validation.isValidRequestBody(requiredBody)) {
      return res.status(400).send({ status: false, msg: "please provide  details" })
    }

    if (!validation.isValid(title)) {
      return res.status(400).send({ status: false, msg: "title is required" })
    }

    if (["Mr", "Mrs", "Miss", "Mast"].indexOf(title) == -1) { return res.status(400).send({ status: false, message: "title should be Mr,Miss,Mrs" }) }


    if (!validation.isValid(name)) {
      return res.status(400).send({ status: false, msg: "Name is required" })

    }
    if (!validation.isValid(email)) {
      return res.status(400).send({ status: false, msg: "Email is required" })
    }

    if (address) {
      let check = Object.values(address)
      if (check.length > 0) {
        for (let i = 0; i < check.length; i++) {
          if (!validation.isValid(check[i])) { return res.status(400).send({ status: false, msg: "address is not valid" }) }
        }
      }
    }


    let pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/
    if (!pattern.test(password)) {
      return res.status(400).send({ status: false, message: "Valid password is required" })
    }

    let pattern1 = /^(\+91[\-\s]?)?[0]?(91)?[6-9]\d{9}$/
    if (!pattern1.test(phone)) {
      return res.status(400).send({ status: false, message: "Valid Mobile Number is required" })
    }


    let validEmailFormat = await validator.validate(email);
    if (!validEmailFormat) {
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    }


    let validEmail = await userModel.findOne({ email: email });
    if (validEmail) {
      return res.status(400).send({ status: false, msg: "Email Alrady Exist" });
    }


    let validNumber = await userModel.findOne({ phone: phone });
    if (validNumber) {
      return res.status(400).send({ status: false, msg: "phone Number Already Exist" });   // 400 for duplication
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

  let validEmailFormat = await validator.validate(data1);
    if (!validEmailFormat) {
      return res.status(400).send({ status: false, msg: "Invalid Email format" });
    }

  let checkData = await userModel.findOne({ email: data1, password: data2 });

  if (!checkData) {
    res.status(404).send({ status: false, msg: 'Invalid Credential' });
  }
  else {  
    let token = jwt.sign({ userId: checkData._id }, "function1Up", { expiresIn: '1000s' });
    // res.setHeader("x-api-key", token);
    res.status(200).send({status: true, data: "logged in successfully", token:  token })
  }
}


module.exports = { createUser, userLogIn }