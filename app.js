//jshint esversion:6
require('dotenv').config()
const  express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const mongoose = require('mongoose')
const User = require('./Schemas/UserSchema.js')
const session = require('express-session')
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;


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


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/',(req,res)=>{
  res.render("home")
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/secrets',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {

    res.redirect('/secrets');
  });

app.get('/login',(req,res)=>{
  res.render("login")
})

app.get('/secrets',(req,res)=>{
  User.find({"secret":{$ne:null}},(err,found_users)=>{
    if(err)
    console.log(err);
    else{
      res.render("secrets",{userswithsecret:found_users})
    }
  })
})


app.get('/submit',(req,res)=>{
  if (req.isAuthenticated()){
    res.render('submit')
  }
  else{
    res.redirect('/login')
  }
})

app.get('/register',(req,res)=>{
  res.render("register")
})

app.get('/logout',(req,res)=>{
  req.logout();
  res.redirect('/')
})

app.post('/submit',(req,res)=>{
  var user_secret = req.body.secret
  User.findById(req.user.id,function(err,founduser){
    if(err){console.log(err)}
    else{founduser.secret=user_secret
         founduser.save((err)=>{
           if(err)
           console.log(err)
           else{
                 res.redirect('/secrets')
           }
         })
      }

  })
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
