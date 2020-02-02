//jshint esversion:6
const  express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const User = require('./Schemas/UserSchema.js')
const bcrypt = require('bcrypt');
const saltRounds = 10;



app = express()
app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}))

mongoose.connect('mongodb://localhost:27017/my_database',{useNewUrlParser:true,useUnifiedTopology: true},()=>{
  console.log('Database Connected');
});





app.get('/',(req,res)=>{
  res.render("home")
})

app.get('/login',(req,res)=>{
  res.render("login")
})

app.get('/register',(req,res)=>{
  res.render("register")
})

app.post('/register',(req,res)=>{
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    const newUser = new User({
      email:req.body.username,
      password: hash
    })
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
      res.render("secrets")}
      })
});
})

app.post('/login',(req,res)=>{
const username = req.body.username
const password = req.body.password
console.log("tt1");
User.findOne({email:username},function(err,foundUser){
  if(err){
    console.log('err')
  }
  else
  {
    bcrypt.compare(password, foundUser.password, function(err, result) {
      if(result)
       res.render("secrets")
       else
       console.log(err)
     });

  }

})
})

app.listen(3000,()=>{
  console.log('Listening')
});
