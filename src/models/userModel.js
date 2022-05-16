const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true,
    enum: ["Mr", "Mrs", "Miss"]
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    trim: true,
    required: true,
    unique: true,
},

  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  password: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    street: {type :String,trim : true},
    city: {type :String,trim : true },
    pincode: {type :String , trim : true}
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })


module.exports = mongoose.model('User', userSchema)