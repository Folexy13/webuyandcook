var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose=require("passport-local-mongoose");


var userSchema = new Schema({
    email: { type: String, unique:true, required: true },
    password: { type: String, required: true },
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    phone: {type: String, required: true},
    lname: { type: String, required: true },
    address: { type: String, required: true },
    userImage: { type: String, required: true, data: Buffer },
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