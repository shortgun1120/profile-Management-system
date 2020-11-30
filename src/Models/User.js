const mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    name: {
        type: String,
    },
    userName:{
        type:String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim :true
    },
    password: {
        type: String,
    },
    profilePath:{
        type: String
    }
});
var User = mongoose.model('User', UserSchema);
module.exports = {
    User
}