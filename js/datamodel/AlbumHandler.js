var albumInfo = require('./datamodel/AlbumInfo');
module.exports = function(app) {
	// api ---------------------------------------------------------------------
	app.post('/api/saveAlbum/', function(req, res) {
		// Getting all the online friends
		albumInfo.create({
			userid : req.body.userid,
			done: false
		}, function(err, infos) {
			if (err){
				res.send(err);
			}else{
				res.send("1");
			}
		});
	});
}

// global.nodeEventer.subscribe('ON_VIDEO_PUBLISH', function(data){
	// console.log("info.videoPath"+data.info.videoPath);
	// feedInfo.update({path: data.info.videoPath}, {$set: {isReady: true}}, function(error, infos){
		// if(error){
			// console.log("Error"+error);
		// }else{
			// console.log("video feed updated");
		// }
	// });
// });