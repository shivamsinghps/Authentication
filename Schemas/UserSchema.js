require('dotenv').config()
const encrypt = require('mongoose-encryption');

const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  email:String,
  password:String
})

UserSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields: ['age']});

const User = mongoose.model("User",UserSchema)
module.exports = User
