const express = require('express');
var route = express.Router();
const {User} = require('./../Models/User')
const _ = require('lodash');
const bodyParser = require('body-parser');
const fs = require('fs');
var randomString = () => {
    var arr = ["A","B","C","D","E","F","G","H","I","J","K"
        ,"L","M","N","O","P","Q","R","S","T","U","V","W","X",
        "Y","Z"
    ];
    var string = ""
    for(var i = 0; i<=10; i++){
        string = string+arr[Math.floor(Math.random() * 26)];
    }
    return string;
}
route.get('/',(req,res)=>{
    res.render('home');
});
route.get('/login', (req,res)=>{
    res.render('login');
});

route.post('/login',(req,res)=>{
    var body = _.pick(req.body, ['username','password']);
    User.findOne({userName:body.username, password: body.password}).then((user)=>{
        if(!user) res.redirect('/login?msg=wrong');
        else{
            req.session.user = user;
            res.redirect('/profile');
        }
    }).catch((err)=>{
        res.send({msg:"Internal Server Error"});
    });
});

route.get('/register', (req, res)=>{
    res.render('register',{title:"Register"})
});
route.post('/register', (req,res)=>{
    var body = _.pick(req.body,['name','userName','email','password','img','profilePath']);
    body.profilePath = "";
    if(req.files.img){
        var randName = randomString()
        var path = 'public/image/'+randName+'.jpg';
        req.files.img.mv(path);
        body.profilePath = path;
        var data = new User(body)
        data.save().then((user)=>{
            req.session.user = user;
            res.redirect('/profile');
        }).catch((err)=>{
            res.redirect('/register?msg=internalServerError');
        });
    }else{
        res.redirect('/register?msg=imageNotFound');
    }
});
route.get('/profile',(req,res)=>{
    if(req.session.user){
        res.render('profile',{title:req.session.user.name, user:req.session.user});
    }else{
        res.redirect('/login?msg=loginRequired');
    }
});
route.get('/logout',(req,res)=>{
    if(req.session.user){
        req.session.destroy((err)=>{
            if(err) res.send(err);
            else res.redirect('/login');
        })
    }else{
        res.redirect('/login');
    }
});

route.get('/editprofile', (req,res)=>{
    if(req.session.user){
        res.render('editprofile',{title:"Edit Profile", user:req.session.user});
    }else{
        res.redirect('/login');
    }
});
route.post('/editprofile', (req,res)=>{
    if(req.session.user){
        var body = _.pick(req.body,['name','userName','email','password','img','profilePath']);
        if(req.files){
            fs.unlink(req.session.user.profilePath,(err)=>{
                if(err) console.log(err);
                else{
                    var randomName = randomString()
                    var path = 'public/image/'+randomName+'.jpg';
                    req.files.img.mv(path);
                    body.profilePath = path;
                    User.findOneAndUpdate({userName:req.session.user.userName},{
                        $set:{
                            name:body.name,
                            userName: body.userName,
                            email: body.email,
                            password: body.password,
                            profilePath: body.profilePath
                        }
                    }).then((user)=>{
                        req.session.user.name = body.name;
                        req.session.user.userName = body.userName;
                        req.session.user.email = body.email;
                        req.session.user.password = body.password
                        req.session.user.profilePath = body.profilePath;
                        console.log(req.session.user)
                        res.redirect('/editprofile');
                    }).catch((err)=>{
                        res.send(err);
                    });
                }
            });
            
        }else{
            User.findOneAndUpdate({userName:req.session.user.userName},{
                $set:{
                    name: body.name,
                    userName: body.userName,
                    email: body.email,
                    password:body.password
                }
            }).then((user)=>{
                req.session.user.name = body.name;
                req.session.user.userName = body.userName;
                req.session.user.email = body.email;
                req.session.user.password = body.password
                console.log(user)
                res.redirect('/editprofile');
            }).catch((err)=>{
                res.send(err);
            });
        }
    }else{
        res.redirect('/login');
    }
});
module.exports = {
    route
}