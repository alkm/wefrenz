var userInfo = require('./model/userinfo');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all users
	app.post('/api/profileInfo/', function(req, res) {
		console.log("Trying to fetch data");

		//var generalDataSetInfo = new Object();
		// use mongoose to get all users in the database
		userInfo.findOne({username: req.body.profileid}, function(err, infos) {
			
			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			//res.json({"profilepic" : infos.profilepic, "username" : infos.username});
			res.json(infos);
		});
	});

	app.post('/api/saveWallPicPos/', function(req, res) {	
		// Getting all the information related to wall pic
		userInfo.update({_id : req.body.profileid }, { $set: {wallpicpos: req.body.wallpicpos}}, function(error, docs){
			if(error){
				console.log("Error"+err);
			}else{
				//console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&yuipee");
			}
		});
	});
}