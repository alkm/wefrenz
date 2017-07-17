var userInfo = require('./model/userinfo');
module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.post('/api/uploadEncodedProfilePic', function(req, res) {
		var profileId = req.body.profilepicinfo.id;
		var profilePicObj = {};
		profilePicObj.previewPicDimension = req.body.profilepicinfo.previewPicDimension;
		profilePicObj.profilePicDimension = req.body.profilepicinfo.profilePicDimension;
		profilePicObj.imageBuffer = req.body.profilepicinfo.profilePicEncoded;
		console.log('.....???????.....'+profileId);
		userInfo.update({_id: profileId}, {$set: {profilepic: profilePicObj}}, function(error, info){
			if(error){
				console.log("Error"+error);
				res.json({"status": "failure", "message": "Failed to update profile pic now, please try again later."});
			}else{
				res.json({"status": "success", "message": "Profile Pic Updated Successfully", "profilepic": profilePicObj});
			}
		});
		
    });
}