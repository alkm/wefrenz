var mongoose = require('mongoose');

module.exports = mongoose.model('userinfo', {
	username: String,
	email : String,
	fullname : String,
	profilepic : Object,
	wallpicpath : String,
	wallpicpos : String, 
	appearance : String,
	rtcid : String,
	done : Boolean
});