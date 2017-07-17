var mongoose = require('mongoose');

module.exports = mongoose.model('SignInInfo', {
	username: String,
	password: String,
	created: {type: Date, default: Date.now}
});