var userInfo = require('./model/userinfo');
module.exports = function(app) {

	// api ---------------------------------------------------------------------

	app.post('/api/querySearch/', function(req, res) {
		var searchInfo = req.body.searchparam ;
		userInfo.find(
	        { $text : { $search : searchInfo } }
	    )
	    /*.sort({ score : { $meta : 'textScore' } })*/
	    .exec(function(err, results) {
	    	if(err)	{
				res.send(err);
			}else{
				res.send(results);
			}
	    });
		/*userInfo.aggregate({ $match: { $text: { $search: searchInfo } } }, function(err, infos){
			if(err)	{
				res.send(err);
			}
				res.send(infos);
		})*/
	});
}