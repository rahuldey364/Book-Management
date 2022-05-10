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
    street: String,
    city: String,
    pincode: String
  },
  
  isDeleted: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)