var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose=require("passport-local-mongoose");


var userSchema = new Schema({
    username: {type: String},
    email: { type: String, unique:true, required: true },
    password: { type: String, required: true },
    fname: {type: String, required: true},
    lname: { type: String, required: true },
    mname: { type: String },
    phone: {type: String, required: true},
    lname: { type: String, required: true },
    address: { type: String, required: true },
    userImage: { type: String, data: Buffer },
    school: {type: String, required: true},
    department: { type: String, required: true },
    level: { type: String, required: true },
    timestamp: {type: String},
    resetPasswordToken: {type: String},
    resetPasswordExpires: {type: Date},
})

userSchema.methods.encryptPassword = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}


userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);