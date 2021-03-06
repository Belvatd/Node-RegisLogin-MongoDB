let mongoose = require ('mongoose');
let bcrypt = require('bcrypt');

let UserSchema= new mongoose.Schema({
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,  
    },
    passwordConf:{
        type: String,
        required: true
    }
});

UserSchema.statics.authenticate = function(email, password, callback){
    User.findOne({email:email}).exec(function(err,user){
        if(err){
            return callback(err);
        } else if (!user){
            let err = new Error('User tidak ditemukan.');
            err.status= 401;
            return callback(err);
        }
        bcrypt.compare(password, user.password, function(err, result){
            if (result == true){
                return callback (null, user);
            }else{
                return callback();
            }
        });
    });
};

UserSchema.pre('save', function(next){
    let user = this;
    bcrypt.hash(user.password, 10, function(err,hash){
        if (err){
            return next(err);
        }
        user.password=hash;
        next();
    });
});

let User = mongoose.model('User', UserSchema);
module.exports=User;