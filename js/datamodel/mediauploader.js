var path = require('path');
var fs = require('fs');
var multer = require('multer');
var path = require('path');
var uploadedCoverPicPath = '';
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'media/images/coverpics/')
  },
  filename: function (req, file, cb) {
  	uploadedCoverPicPath = 'coverpic_'+ssn.email+'_'+Date.now()+path.extname(file.originalname);
    cb(null, uploadedCoverPicPath); //Appending extension
  }
});

var upload = multer({ storage: storage });
var userInfo = require('./model/userinfo');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.post('/api/uploadEncodedProfilePic', function(req, res) {
		var profileId = req.body.profilepicinfo.id;
		var profilePicObj = {};
		profilePicObj.previewPicDimension = req.body.profilepicinfo.previewPicDimension;
		profilePicObj.profilePicDimension = req.body.profilepicinfo.profilePicDimension;
		profilePicObj.imageBuffer = req.body.profilepicinfo.profilePicEncoded;
		userInfo.update({_id: profileId}, {$set: {profilepic: profilePicObj}}, function(error, info){
			if(error){
				console.log("Error"+error);
				res.json({"status": "failure", "message": "Failed to update profile pic now, please try again later."});
			}else{
				res.json({"status": "success", "message": "Profile Pic Updated Successfully", "profilepic": profilePicObj});
			}
		});
		
    });

    //Cover Pic Upload
	app.post('/api/uploadCoverPic', upload.single('uploadfile'), (req, res) => {
		var coverPicPos = req.body.coverpicpos;
		uploadedCoverPicPath = 'media/images/coverpics/'+uploadedCoverPicPath;
		userInfo.update({username: ssn.email}, {$set: {wallpicpath: uploadedCoverPicPath, wallpicpos: coverPicPos}}, function(error, info){
			if(error){
				res.json({"status": "failure", "message": "Failed to update profile pic now, please try again later."});
			}else{
				res.json({"status": "success", "message": "Cover Pic Uploaded Successfully", "wallpicpath": uploadedCoverPicPath});
			}
		});
	});


	app.post('/api/saveCoverPicPos',  function(req, res){
		var coverPicPos = req.body.coverpicpos;
		console.log('****((('+req.body.coverpicpos);
		userInfo.update({username: ssn.email}, {$set: {wallpicpos: coverPicPos}}, function(error, info){
			if(error){
				res.json({"status": "failure", "message": "Failed to update cover pic position now, please try again later."});
			}else{
				res.json({"status": "success", "message": "Cover Pic Position Updated Successfully", "wallpicpos": info.wallpicpos});
			}
		});
	});
}