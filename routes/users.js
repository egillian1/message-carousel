const express = require('express');
const router = express.Router();
const User = require("../models/user");
const bcrypt = require('bcrypt');

// Login handle
router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/register',(req,res)=>{
    res.render('register')
})

// Register handle
router.post('/register',(req,res)=>{
    const {email, password, password2} = req.body;
    let errors = [];
    console.log('Register for name email :' + email + ' pass:' + password);
    if(!email || !password || !password2) {
        errors.push({msg : "Please fill in all fields"})
    }

    // Check if match
    if(password !== password2) {
        errors.push({msg : "Passwords dont match"});
    }

    // Check if password is more than 6 characters
    if(password.length < 6 ) {
        errors.push({msg : 'Password must be at least 6 characters'})
    }

    // Send error messages to user
    if(errors.length > 0 ) {
        console.log("Errors found: ", errors);
        res.render('register', {
            errors : errors,
            email : email,
            password : password,
            password2 : password2})
        return
    }

    // Find duplicate
    User.findOne({email : email}).exec((err,user)=>{
        if(user) {
            errors.push({msg: 'Email already registered'});
            render(res, errors, email, password, password2);
            return
        }
    });

    // Validation passed, create user

    // Hash password
    bcrypt.genSalt(10,(err, salt) =>
    bcrypt.hash(password, salt, (err, hash) => {
        console.log("hashing parameters", password, salt, hash);
        if(err) {
            throw err;
        }

        // Create and save user
        const newUser = new User({
           email: email,
           password: hash
        });

        console.log("newUser", newUser);

        newUser.save().then((value) => {
           console.log(value)
           res.redirect('/users/login');
        })
        .catch(value=> console.log(value));
    }));
})

router.post('/login',(req,res,next)=>{

})

//logout
router.get('/logout',(req,res)=>{

})

module.exports  = router;
