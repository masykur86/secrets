//jshint esversion:
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const app = express();
const port = 3000;


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
console.log(md5('okdeodkeod')); 

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://localhost:27017/secrets', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});


// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    
    email:{
        type:String,
        required:true,
        unique:true,
    },
    
    password:{
        type:String,
        required:true,
    },
});

//Export the model
const Secret = mongoose.model('Secret',userSchema);

app.get('/', (req, res) => {
  res.render("home");
});


app.get('/login', (req, res) => {
    res.render("login");
  });

  
app.get('/register', (req, res) => {
    res.render("register");
  });

  app.post('/register', function (req, res) {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new Secret({
                email:req.body.username,
                password:hash
            });
        
            newUser.save(function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('secrets');
                }
                
            }) 
        });
    });

 

  });

app.post('/login', function (req, res) {
  
    Secret.findOne({ 
        email:req.body.username
    }, (err, docs) => {
       if(err){
           console.log(`Error: ` + err)
       } else{
         if(docs.length === 0){
             console.log("message")
         } else{
            bcrypt.compare(req.body.password, docs.password, function(err, result) {
                if (result === true){
                    res.render('secrets');
                }
            });
           
         }
       }
    });
})
  










app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port port!`))