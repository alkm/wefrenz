define(['app'], function (app) {
	//Smiley services
	app.register.factory('CreateSmileys', function() {
		return{
			setSmileys : function(post) {
				return post
				.replace(/:\)/gi,"<span><img src='/images/defaultimages/smileys/socialutility-emotion0-smile.gif'></img></span>")
				.replace(/:\(/gi,"<span><img src='/images/defaultimages/smileys/socialutility-emotion1-sadsmile.gif'></img></span>")
				.replace(/B=\)/gi,"<span><img src='/images/defaultimages/smileys/socialutility-emotion3-cool.gif'></img></span>")
				
				.replace(/:\D/,"<span><img src='/images/defaultimages/smileys/socialutility-emotion2-bigsmile.gif'></img></span>")
				.replace(/B=\)/,"<span><img src='/images/defaultimages/smileys/socialutility-emotion3-cool.gif'></img></span>")
				.replace(/:\=\O/,"<span><img src='/images/defaultimages/smileys/socialutility-emotion4-surprised.gif'></img></span>")
			.replace(/;\)/,"<span><img src='/images/defaultimages/smileys/socialutility-emotion5-wink.gif'></img></span>")
			.replace(/;\(/,"<span><img src='/images/defaultimages/smileys/socialutility-emotion6-crying.gif'></img></span>");
			
			}
		};
	})

});