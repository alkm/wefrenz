var mongoose = require('mongoose');
module.exports = mongoose.model('feedinfo', {
	userid : String,
	email : String,
	fullname : String,
	profilepicpath : String,
	post : String,
	type : String,
	path : String,
	poster : String,
	isReady : Boolean,
	isNotified : Boolean,
	coolArr : Array,
	commentArr : Array,
	colorInfo : String,
	fontFamily : String,
	fontSize : String,
	fontStyle : String,
	fontDecoration : String,
	fontWeight : String,
	addWatcherArr : Array,
	done : Boolean
});