var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://abhansh:abhansh123@ds259255.mlab.com:59255/webappretail');
var db = mongoose.connection;

var ProductSchema = mongoose.Schema({
    productname:{
        type:String,
        required:true
    },
    barcode:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    currentstock:{
        type:Number,
        required:true
    },
    criticalstock:{
        type:Number,
        required:true
    }
});

module.exports = Product = mongoose.model('Product', ProductSchema);

module.exports.saveProduct = function(newProd, callback){
    newProd.save(callback);
}


module.exports.getProduct = function(callback){
    Product.find({}, function(err, results){
        if(err){return callback(err, null)};
        var cstock = [];
        var i=0;
        console.log("getproduct called");
        for(var key in results){
            console.log(results[key].criticalstock);
            console.log(results[key].currentstock);
            if(results[key].criticalstock > results[key].currentstock){
                cstock.push(results[key]);
                i++;
            } 
        }
        console.log("returning value now");
        console.log(i);
        return callback(null, {
            results:results,
            cstock:cstock,
            crc:i
        })
    });
    
}

module.exports.deleteProduct = function(id, callback){
    Product.findOneAndRemove({_id:id}, callback);
}