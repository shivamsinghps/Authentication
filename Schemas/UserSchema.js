
// const encrypt = require('mongoose-encryption');
const passportLocalMongoose = require('passport-local-mongoose')

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email:String,
  password:String
})

userSchema.plugin(passportLocalMongoose)
// userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User",userSchema)
module.exports = User
