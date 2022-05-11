const mongoose = require('mongoose')

const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment')
let date = moment().format('YYYY-MM-DD')
console.log(date)
// const ObjectId = mongoose.Schema.Types.ObjectId

const reviewSchema = new mongoose.Schema({

    
        bookId: {type:ObjectId, required : true, ref :"Book"},
        reviewedBy: {type :String, required:true, default :'Guest'},
        reviewedAt: {type:Date, required : true},
        rating: {type : Number, min: 1 , max : 5 ,  required : true}, // Rating number should lie between 1 to 5
        review: {type :String , trim : true}, // All fields in a mongoose schema are optional by default (besides _id, of course). A field is only required if you add required: true to its definition. So define your schema as the superset of all possible fields, adding required: true to the fields that are required. isDeleted: {type : Boolean, default: false},
        isDeleted : {type : Boolean , default : false}
        
      }, {timestamps : true})

      module.exports =  mongoose.model('Review' ,reviewSchema)
