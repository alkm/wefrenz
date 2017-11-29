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
  	uploadedCoverPicPath = 'coverpic_'+Date.now()+path.extname(file.originalname);
    cb(null, uploadedCoverPicPath); //Appending extension
  }
});

var upload = multer({ storage: storage });
var userInfo = require('./model/userinfo');

module.exports = function(app) {

	// api ---------------------------------------------------------------------
	app.post('/api/uploadEncodedProfilePic', function(req, res) {
		try{
			if(ssn === undefined){
				res.json({"status": "sessionExpired", "message": "Please Login"});
				return;
			}
		}catch(err){
			res.json({"status": "sessionExpired", "message": "Please Login"});
			return;
		}
		
		var profilePicObj = {};
		profilePicObj.previewPicDimension = req.body.previewpicdimension;
		profilePicObj.profilePicDimension = req.body.profilepicdimension;
		profilePicObj.imageBuffer = req.body.imagebuffer;

		
		userInfo.update({username: ssn.email}, {$set: {profilepic: profilePicObj}}, function(error, info){
			if(error){
				console.log("Error"+error);
				res.json({"status": "failure", "message": "Failed to update profile pic now, please try again later."});
			}else{
				userInfo.findOne({username: ssn.email}, function(err, info){
					if(err){
						console.log(err);
					}else{
						res.json({"status": "success", "message": "Profile Pic Updated Successfully", "info": info});
					}
				});
			}
		});
		
    });

    //Cover Pic Upload
	app.post('/api/uploadCoverPic', upload.single('uploadfile'), (req, res) => {
		var coverPicPos = req.body.coverpicpos;
		try{
			if(ssn === undefined){
				res.json({"status": "sessionExpired", "message": "Please Login"});
				return;
			}
		}catch(err){
			res.json({"status": "sessionExpired", "message": "Please Login"});
			return;
		}

		uploadedCoverPicPath = 'media/images/coverpics/'+uploadedCoverPicPath;
		userInfo.findOne({username: ssn.email}, function(err, info){
			if(err){
				res.send(err);
			}else{
				if(info.wallpicpath !== ''){
					if (fs.existsSync(info.wallpicpath)) {
					    // Do something
					    console.log('cover pic exists');
					    fs.unlinkSync(info.wallpicpath);
					}else{
						console.log('cover pic does not exist');
					}
				}

				//res.json({"status": "success","message": "This User "+info.fullname+ " already Exists", "info": info});
				userInfo.update({username: ssn.email}, {$set: {wallpicpath: uploadedCoverPicPath, wallpicpos: coverPicPos}}, function(error, info){
					if(error){
						res.json({"status": "failure", "message": "Failed to update profile pic now, please try again later."});
					}else{
						res.json({"status": "success", "message": "Cover Pic Uploaded Successfully", "wallpicpath": uploadedCoverPicPath});
					}
				});
			}
		});

	});


	app.post('/api/saveCoverPicPos',  function(req, res){
		var coverPicPos = req.body.coverpicpos;
		try{
			if(ssn === undefined){
				res.json({"status": "sessionExpired", "message": "Please Login"});
				return;
			}
		}catch(err){
			res.json({"status": "sessionExpired", "message": "Please Login"});
			return;
		}
		userInfo.update({username: ssn.email}, {$set: {wallpicpos: coverPicPos}}, function(error, info){
			if(error){
				res.json({"status": "failure", "message": "Failed to update cover pic position now, please try again later."});
			}else{
				res.json({"status": "success", "message": "Cover Pic Position Updated Successfully", "wallpicpos": info.wallpicpos});
			}
		});
	});
}