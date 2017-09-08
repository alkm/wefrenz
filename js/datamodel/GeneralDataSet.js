var userInfo = require('./model/userinfo');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	// get all users
	app.post('/api/getGeneralDataSet/', function(req, res) {
		console.log("Trying to fetch data");

		//var generalDataSetInfo = new Object();
		// use mongoose to get all users in the database
		userInfo.findOne({_id: req.body.userid}, function(err, infos) {

			// if there is an error retrieving, send the error. nothing after res.send(err) will execute
			if (err){
				res.send(err)
			}
			//res.json({"userid" : infos._id, "profilepicpath" : infos.profilepicpath, "email" : infos.email, "fullname" : infos.fullname});
			res.send(infos);
		});
	});
}