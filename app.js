//jshint esversion:6
require('dotenv').config()
const  express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const User = require('./Schemas/UserSchema.js')

const session = require('express-session')
const passport = require('passport')




app = express()
app.use(express.static("public"))
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({
  extended:true
}))

app.use(session({
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

mongoose.connect('mongodb://localhost:27017/my_database',{useNewUrlParser:true,useUnifiedTopology: true},()=>{
  console.log('Database Connected');
});

mongoose.set("useCreateIndex",true)

passport.use(User.createStrategy());


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.get('/',(req,res)=>{
  res.render("home")
})

app.get('/login',(req,res)=>{
  res.render("login")
})

app.get('/secrets',(req,res)=>{
  if (req.isAuthenticated()){
    res.render('secrets')
  }
  else{
    res.redirect('/')
  }
})

app.get('/register',(req,res)=>{
  res.render("register")
})

app.post('/register',(req,res)=>{

  User.register({username:req.body.username},req.body.password,function(err,user){
    if(err)
    {
      console.log('laggaye')
      res.redirect('/register');
    }
    else{
      console.log('bachgaye')
      passport.authenticate("local")(req,res,function(){
        res.redirect('/secrets')
      })
    }
  })

})

app.post('/login',(req,res)=>{

  const nuser =new User({
    username:req.body.username,
    password:req.body.password
  })

  req.login(nuser,function(err){
    if(err)
    console.log(err)
    else{
      passport.authenticate("local")(req,res,function(){
        res.redirect('/secrets')
      })
    }
  })


})

app.listen(3000,()=>{
  console.log('Listening')
});
