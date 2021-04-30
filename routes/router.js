const express = require('express');
const router = express.Router();
const User = require ('../models/user');

router.get('/', (req, res, next)=>{
    res.render('login');
});

router.get('/register', (req, res, next)=>{
    res.render('register');
});

router.post('/auth',(req, res, next)=>{
    if(req.body.password !== req.body.passwordConf){
        let err = new Error('Password tidak cocok!');
        err.status = 400;
        res.send('Password tidak cocok!');
        next(err);
    }

    if(
        req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf
    ){
        let userData={
            email: req.body.email,
            username: req.body.username,
            password: req.body.password,
            passwordConf: req.body.passwordConf
        };
        
        User.create(userData, (error,user)=>{
            if(error){
                next(error);
            }else{
                req.session.userId= user._id;
                res.redirect('/profil');
            }
        });
    } else if(req.body.logemail && req.body.logpassword){
        User.authenticate(
            req.body.logemail,
            req.body.logpassword,
            (error, user)=> {
                if (error|| !user){
                    let err = new Error('Email/Password anda salah!');
                    err.status=401;
                    next(err);
                }else{
                    req.session.userId = user._id;
                    res.redirect('/profil');
                }
            }
        );
    } else {
        let err = new Error('Mohon inputan diisi!');
        err.status=400;
        next(err);
    }
});

router.get('/profil', (req, res, next)=>{
    User.findById(req.session.userId).exec((error, user)=>{
        if(error){
            next(error);
        }else{
            if(user==null){
                setTimeout(function(){
                    let err = new Error('Silahkan login dahulu!');
                    err.status= 400;
                    next(err);
                }, 1000);
            } else{
                res.render('home',{
                    namaUser: user
                });
            }
        }
    });
});


router.get('/logout',(req, res, next)=>{
    if(req.session){
        req.session.destroy(err=>{
            if(err){
                next(err);
            }else{
                res.redirect('/');
            }
        });
    }
});

module.exports = router;