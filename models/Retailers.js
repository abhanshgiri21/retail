var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://abhansh:abhansh123@ds259255.mlab.com:59255/webappretail');

//mongoose.connect('mongodb://localhost/retail')
var db = mongoose.connection;

var RetailerSchema = mongoose.Schema({
   username:{
       type:String,
       required:true
   },
   password:{
       type:String,
       required:true,
       bcrypt:true
   }
});

module.exports = Retailer = mongoose.model('Retailer', RetailerSchema);

module.exports.getByUsername = function(username, callback){
    Retailer.findOne({username:username}, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    console.log('***************************');
    console.log(candidatePassword);
    console.log(hash);
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);
	});
}

module.exports.createRetailer = function(newRetailer, callback){
    bcrypt.hash(newRetailer.password, 10, function(err, hash){
        if(err) {throw err};
        newRetailer.password = hash;
        console.log(newRetailer);
        newRetailer.save(callback);
    })
    
}

module.exports.getUserById = function(id, callback){
    Retailer.findOne({_id:id}, callback);
}