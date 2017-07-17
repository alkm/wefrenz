var mongoose = require('mongoose');

module.exports = mongoose.model('chat', {
	name: String,
	msg: String,
	created: {type: Date, default: Date.now}
});