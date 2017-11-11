var express = require('express');
var router = express.Router();
var Retailer = require('../models/Retailers');
var Product = require('../models/Products');
var User = require('../models/Users');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;



/* GET home page. */
router.get('/', checkAuthenticated,function(req, res, next) {
	Product.getProduct(function(err, data){
		if(err) {throw err};
		console.log("rendering page now")
		res.render('retailer',{
			products: data.results,
			cstock: data.cstock,
			crc:data.crc
		})
	})
});



passport.use(new LocalStrategy(
	function(username, password, done){
		console.log("local strategy called");
		Retailer.getByUsername(username, function(err, user){
			console.log("get by username called");
			if(err) throw err;
			if(!user){
				console.log("local strat user not dound");
				console.log(user);
				return done(null, false, {message:'Wrong username'});
			}

			Retailer.comparePassword(password, user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null, user);
				}else{
					console.log('Invalid Password');
					return done(null, false, {message:'Invalid Password'});
				}
			})
		})
	}
));


passport.serializeUser(function(user, done) {
	done(null, user.id);
  });
  
passport.deserializeUser(function(id, done) {
	Retailer.getUserById(id, function(err, user) {
		done(err, user);
	});
});




router.post('/login',function(req, res, next) {
	console.log("just calling local strategy");
	passport.authenticate('local', function(err, user, info) {
		if (err) { return next(err); }
		if (!user) { 
			req.flash("info",'No user found with this username');
			//return res.render('login' ); 
			return res.send("user not found");
		}
		req.logIn(user, function(err) {
			if (err) { return next(err); }
			return res.redirect('/retailer'	);
			//res.send("login successfull");
		});
	})(req, res, next);
});

router.get('/logout', checkAuthenticated,function(req, res, next){
	req.logout();
	res.redirect('/');
})

router.post('/signup', checkAuthenticated,function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	console.log("all fields received")

	req.checkBody('username', 'username must not be empty');
	req.checkBody('password', 'password must not be empty');
	req.checkBody('password2', 'confirm password must not be empty');
	req.checkBody('password', 'Passwords do not match').Equals(password2);

	var errors = req.validationErrors();
	console.log("error detection complete");
	console.log(errors);
	
	var newRetailer = new Retailer({
		username : username,
		password : password,
		password2 : password2,
		
	});
	console.log(newRetailer);
	if(errors){
		console.log("errors found" + errors);
		// res.render('signup', {
		// 	newRetailer: newRetailer,
		// 	errors:errors
		// 	}
		// );
		res.send(errors);
		res.end();
	}else{
		Retailer.getByUsername(newRetailer.username, function(err, user){
			if(err) throw err;
			if(user.length>0){
				console.log(user);
				req.flash("info",'Username already exists');
				// res.render('signup');
				res.send("user already exists");
			}else{
				Retailer.createRetailer(newRetailer, function(err, user){
					if(err) throw err;
					if(user){
						req.flash("info",'Retailer created');
						// res.render('login');
						res.send("user created" + user);
					}
				});
			}
		});
	} 
});

router.get('/adduser', checkAuthenticated,function(req, res, next){
	res.render('user');
})

router.post('/adduser', checkAuthenticated,function(req, res, next){
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var fname = req.body.fname;
	var lname = req.body.lname;
	var city = req.body.city;
	var pincode = req.body.pincode;
	var address = req.body.address;
	var country = req.body.country;
	var email  = req.body.email;
	

	req.checkBody('username', 'username must not be empty');
	req.checkBody('password', 'password must not be empty');
	req.checkBody('password2', 'confirm password must not be empty');
	req.checkBody('password', 'Passwords do not match').Equals(password2);
	req.checkBody('fname', 'fname must not be empty');
	req.checkBody('lname', 'lname must not be empty');
	req.checkBody('address', 'address must not be empty');
	req.checkBody('city', 'city must not be empty');
	req.checkBody('country', 'country must not be empty');
	req.checkBody('email', 'email must not be empty');

	var errors = req.validationErrors();
	var newUser = new User({
		username : username,
		password : password,
		city : city,
		email : email,
		pincode : pincode,
		address:address,
		country : country,
		email : email,
		fname:fname,
		lname:lname		
	});
	console.log("erros check done");
	console.log(errors);
	console.log(newUser);

	if(errors){
		res.render('user', {
			newUser: newUser,
			errors:errors
			}
		);
		// res.send(errors);
		// res.end();
	}else{
		console.log("else called");
		User.getByUsername(newUser.username, function(err, user){
			if(err) throw err;
			console.log(user);
			if(user){
				req.flash("info",'Username already exists');
				res.render('adduser');
				//res.send("user already exists");
			}else{
				console.log("else called again")
				User.createUser(newUser, function(err, user){
					console.log("&&&&&&&&&&&&&&&&&&&&");
					console.log(err);
					if(err) throw err;
					console.log(user);
					if(user){
						req.flash("info",'User created');
						res.redirect('/retailer');
						//res.send("user created");
					}
				});
			}
		});
	}
});

router.get('/workers', checkAuthenticated,function(req, res, next){
	User.getAllUsers(function(err, results){
		if(err){throw err};
		res.render('showworker',{results:results});
	});
});

router.get('/addproduct', checkAuthenticated, function(req, res, next){
	res.render('addproduct');
})

router.post('/addproduct', checkAuthenticated,function(req, res, next){
	var productname = req.body.productname;
	var barcode = req.body.barcode;
	var price = req.body.price;
	var discount = req.body.discount;
	var currentstock = req.body.currentstock;
	var criticalstock = req.body.criticalstock;

	req.checkBody('productname', "product name is required");
	req.checkBody('barcode', "barcode is required");
	req.checkBody('price', "price is required");
	req.checkBody('discount', "discount is required");
	req.checkBody('currentstock', "current stock is required");
	req.checkBody('critical stock', "critical stock is required");


	var errors = req.validationErrors();

	if(errors){
		// res.render('addproduct', {
		// 	errors:errors
		// });

		res.send(errors);
	}else{
		var newProduct = new Product({
			productname : productname,
			barcode : barcode,
			price : price,
			discount : discount,
			currentstock : currentstock,
			criticalstock : criticalstock			
		});

		Product.saveProduct(newProduct, function(err, product){
			if(err) {throw err};
			req.flash("info","product added");
			res.redirect('/retailer');
			//res.send("product added");
		})
	}
});

router.delete('/deleteproduct/:id', function(req, res, next){
	var id = req.params.id;
	Product.deleteProduct(id, function(err, product){
		if(err) {throw err};
		res.send("product deleted" + product);
	});
})

router.delete('/deleteuser/:id', function(req, res, next){
	var id = req.params.id;
	User.deleteUser(id, function(err, product){
		if(err) {throw err};
		res.send("User deleted" + product);
	});
})

function checkAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}else{
		res.redirect('/');
		return false;
	}
}

module.exports = router;
