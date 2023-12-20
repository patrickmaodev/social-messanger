const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const app = express();
const port = 8000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose.connect(
    "mongodb+srv://patrickcharlestz:971997Abcdef.@cluster0.plooqwi.mongodb.net/social-messanger",
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    }
).then(() => {
    console.log('connected to Mongo DB');
}).catch((err) => {
    console.log('Error while connecting to Mongo DB',err);
});
app.listen(port, () => {
    console.log('Server running on port 8000');
});

const User = require("./models/user");
const Message = require("./models/message");

//endpoint for registration of User
app.post('/register',(req,res)=>{
    const {name,email,password,image} = req.body;
    const newUser = new User({ name,email,password,image });
    newUser.save().then(()=>{
        res.status(200).json({'message':'User Registered Successfully'});
    }).catch((err)=>{
        console.log('Error Registered User',err);
        res.status(500).json({'message':'Error Registering User'})
    })
})

// function to create a Token based on user
const createToken = (userId) => {
    //set the token payload
    const payload = {
        userId: userId,
    };
        //generate a token key with secret key and expiration time
        const token = jwt.sign(payload, "Q$r2K6W*n!jCW%Zk", { expiresIn: "1h"});
        return token;
    }

//endpoint for login of user
app.post("/login", (req,res) => {
    const {email,password} = req.body;

    //check if the email and password are provided
    if(!email || !password){
        return res.status(400).json({message:"Email and the password are required"})
    }
    // compare the provided passwords with the password in the database
    if (user.password !== password){
        return res.status(404).json({message:"Invalid Password"})
    }
    const token = createToken(user._id);
    res.status(200).json({token}).catch((error) => {
        console.log("error in finding the user", error);
        res.status(500).json({messsage:"Internal Server Error!"})
    })
})