var mongoose = require('mongoose');

module.exports = mongoose.model('friendsrelationship', {
	userid : String,
	friendid : String,
	requeststatus : String,
	requester : String,
	requester : Object,
	blockedby : String,
	blockedto : String,
	unfriendby : String,
	unfriendto : String,
	done : Boolean
});