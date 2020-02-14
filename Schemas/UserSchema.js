const findOrCreate = require('mongoose-findorcreate')
// const encrypt = require('mongoose-encryption');
const passportLocalMongoose = require('passport-local-mongoose')

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email:{type:String,require:false},
  password:{type:String,require:false},
  googleId:{type:String,require:false},
  secret:{type:String,require:false}
})

userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
// userSchema.plugin(encrypt, { secret:process.env.SECRET, encryptedFields:['password']});

const User = new mongoose.model("User",userSchema)
module.exports = User
