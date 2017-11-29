var signInInfo = require('./model/signininfo.js');
var userInfo = require('./model/userinfo.js');
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
	
	app.post('/api/signUp', function(req, res) {
		console.log('req.body.email'+req.body.email);
		signInInfo.findOne({username: req.body.email}, function(err, users){
			if(err){
				res.send(err);
			}else{
				if(users == null){
					// create a user, information comes from AJAX request from Angular
					signInInfo.create({
						username : req.body.email,
						password: req.body.password,
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
								username : req.body.email,
								fullname : req.body.fullname,
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
	app.post('/api/logIn', function(req, res) {
		ssn = req.session;
		userInfo.collection.ensureIndex({fullname: "text"}, function(error) {});
		try{
			signInInfo.findOne({username: req.body.email}, function(err, users){
				if(err){
					res.send(err);
				}else{
					if(users == null){
						res.json({"status": "failure", "message": "Invalid username"});
					}else{
						if(users.password == req.body.password){
							userInfo.findOne({username: req.body.email}, function(err, info){
								if(err){
									console.log(err);
								}else{
									//req.mySession.username = info.username;
									//req.mySession.userid = info._id;
									ssn.email = info.username;
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
		}catch(err){
			console.log('gotcha'+err);
		}
	});
}