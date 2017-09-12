var signInInfo = require('./model/signininfo');
var userInfo = require('./model/userinfo');
var fs = require('fs');
module.exports = function(app) {
	// api ---------------------------------------------------------------------
	app.post('/api/fbInfo', function(req, res) {
		signInInfo.findOne({username: req.body.fbinfo.email}, function(err, users){
			if(err){
				res.send(err);
			}else{
				if(users == null){
					console.log("User Doesn't Exists");
					// create a user, information comes from AJAX request from Angular
					signInInfo.create({
						username : req.body.fbinfo.email,
						password: req.body.fbinfo.password,
						done : false
					}, function(err, users) {
						if (err){
							res.send(err);
						}else{
							userInfo.create({
								username : req.body.fbinfo.email,
								fullname : req.body.fbinfo.name,
								profilepic : req.body.fbinfo.profilePic,
								wallpicpath : "",
								wallpicpos : "",
								appearance : "offline",
								done : false
							}, function(err, users) {
								if (err){
									res.send(err);
								}else{
									res.json({"status": "success", "message": "Account created successfully", "info": users});
								}
							});	
						}
					});
				}else{
					console.log("User Exists");
					userInfo.findOne({username: req.body.fbinfo.email}, function(err, info){
						if(err){
							res.send(err);
						}else{
							console.log(">>>>>.."+info);
							res.json({"status": "success","message": "This User "+info.fullname+ " already Exists", "info": info});
						}
					});
				}
			}

		});
	});
	
	app.post('/api/signUpInfo', function(req, res) {
		signInInfo.findOne({username: req.body.signupinfo.email}, function(err, users){
			if(err){
				res.send(err);
			}else{
				if(users == null){
					// create a user, information comes from AJAX request from Angular
					signInInfo.create({
						username : req.body.signupinfo.email,
						password: req.body.signupinfo.password,
						done : false
					}, function(err, users) {
						if (err){
							res.send(err);
						}else{
							var profilePicObj = {};
							profilePicObj.previewPicDimension = '100x100';
							profilePicObj.profilePicDimension = '75x75';
							profilePicObj.imageBuffer = 'assets/images/defaultprofilepic.jpg';
						    userInfo.create({
								username : req.body.signupinfo.email,
								fullname : req.body.signupinfo.fullName,
								profilepic : profilePicObj,
								wallpicpath : "",
								wallpicpos : "",
								appearance : "offline",
								done : false
							}, function(err, users) {
								if (err){
									res.send(err);
								}else{
									res.json({"status": "success", "message": "Account created successfully"});
								}
							});	
						}
					});
				}else{
					
					console.log("This User "+JSON.stringify(users)+" already Exists");
					res.json({"status": "failure","message": "This User "+users.username+ " already Exists"});
				}
			}

		});
	});
	app.post('/api/logInInfo', function(req, res) {
		console.log('1'+userInfo);
		userInfo.collection.ensureIndex({fullname: "text"}, function(error) {});
		console.log('2'+signInInfo);
		signInInfo.findOne({username: req.body.logininfo.email}, function(err, users){
		console.log('3');
			if(err){
				res.send(err);
			}else{
				if(users == null){
					res.json({"status": "failure", "message": "Invalid username"});
				}else{
					if(users.password == req.body.logininfo.password){
						userInfo.findOne({username: req.body.logininfo.email}, function(err, info){
							if(err){
								console.log(err);
							}else{
								//req.mySession.username = info.username;
								//req.mySession.userid = info._id;
								res.json({"status": "success","message": "Welcome "+info.fullname, "info": info});
							}
							
						});
						
					}
					else{

						res.json({"status": "failure", "message": "Wrong Password"});
					}
				}
			}

		});
	});
}