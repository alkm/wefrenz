var fbInfo = require('./model/fbinfo');
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all users
	app.get('/api/fbInfo', function(req, res) {

		// use mongoose to get all users in the database
		fbInfo.find(function(err, users) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err)
				res.send(err)

			res.json(users); // return all users in JSON format
		});
	});
	app.post('/api/fbInfo', function(req, res) {
		fbInfo.findOne({email: req.body.fbinfo.email}, function(err, users){
			if(err){
				res.send(err);
			}else{
				if(users == null){
					// create a user, information comes from AJAX request from Angular
					console.log(req.body.fbinfo.email+"//"+req.body.fbinfo.email+"//"+req.body.fbinfo.profilePicPath);
					fbInfo.create({
						email : req.body.fbinfo.email,
						name: req.body.fbinfo.name,
						profilepicpath: req.body.fbinfo.profilePicPath,
						done : false
					}, function(err, users) {
						if (err){
							res.send(err);
						}else{
							res.json({"status": "success","message": "This User "+users.email+ " is created"});
						}
					});
				}else{
					
					console.log("This User "+JSON.stringify(users)+" already Exists");
					res.json({"status": "failure","message": "This User "+users.name+ " already Exists"});
				}
			}

		});
	});
}