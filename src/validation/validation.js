const mongoose = require('mongoose')


const isValid = function (value) {
    if (typeof value === "undefined" || value === null ) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

const isValidString= function (value) {
    const noNumber =/^[^0-9]+$/g               ////^[a-zA-Z]{3}/-/d{6}$/                 // /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/                                    ///^[^0-9]+$/g   
    if (typeof value !== 'string') return false
    if(noNumber.test(value) === false) return false
    return true
}


const isValidNumber=  function(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

const isValidISBN= function(ISBN){
    let pattern1 = /^[\d*\-]{10}|[\d*\-]{13}$/                                                                          // ISBN validation
    if (pattern1.test(ISBN))  return true 
}

const isValidRequestBody = function (requestbody) {
    return Object.keys(requestbody).length > 0;
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

module.exports = { isValid , isValidString, isValidNumber, isValidRequestBody, isValidObjectId ,isValidISBN}

