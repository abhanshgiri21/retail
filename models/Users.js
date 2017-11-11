var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/retail');
var db = mongoose.connection;

var UserSchema = mongoose.Schema({
   username:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true,
       bcrypt:true
   },
   city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    pincode:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
});



module.exports = User = mongoose.model('User', UserSchema);

module.exports.getByUsername = function(username, callback){
    User.findOne({username:username}, callback);
}

module.exports.comparePassward = function(candidatePassword, userPassword, callback){
    bcrypt.compare(candidatePassword, userPassword, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}
module.exports.getAllUsers = function(callback){
    User.find({}, callback);
}

module.exports.createUser = function(newUser, callback){
    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err) {throw err};
        newUser.password = hash;
        newUser.save(callback);
    })
}
module.exports.deleteUser = function(id, callback){
    User.findOneAndRemove({_id:id}, callback);
}