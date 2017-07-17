var mongoose = require('mongoose');
module.exports = mongoose.model('albuminfo', {
	userid : String,
	photosArr : Array,
	musicArr : Array,
	videosArr : Array,
	done : Boolean
});