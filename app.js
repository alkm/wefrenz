//var express = require('express')
var express = require('express');
var serveStatic = require('serve-static')
//var app = express()						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
//var port = process.env.PORT || 3000; 
var database = require('./config/database'); 			// load the database config
var routes = require('routes');
global.nodeEventer = require('node-eventer').init();
var bodyParser = require('body-parser');
//var fs = require('fs');
var easyrtc = require("easyrtc"); // EasyRTC external module
//var https = require('https');
var app = express();
// app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
var session = require('express-session');
var ssn ;
app.use(session({secret:'0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK', resave: true, saveUninitialized: true}));

/*var clientSessions = require("client-sessions");
app.use(clientSessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // set this to a long random string!
}));
*/

// configuration ===============================================================
//mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io
mongoose.connect(database.url, { useMongoClient: true }, function(err){
	mongoose.Promise = global.Promise;
	if(err){
		console.log(err);
	} else{
		console.log("Connected to mongodb!");
	}
})
	
	//app.listen(3000)
	var io, socketServer, rtc;
	//var httpsOptions = {};

	var https = require('https');
	var fs = require('fs');
	var port = 3000;

	/*app.get('/', (req, res) => {
	  res.send('WORKING!')
	})*/

	app.use(serveStatic(__dirname + '/'));

	var httpsOptions = {
	  key: fs.readFileSync('./private.key'),
	  cert: fs.readFileSync('./certificate.crt')
	}
	/*const server = https.createServer(httpsOptions, app).listen(port, () => {
	  	console.log('server running at ' + port)

	});*/
	var server = https.createServer(httpsOptions, app).listen(port);
	io = require("socket.io").listen(server);
	socketServer = io.listen(server, {"log level":1});
	// Start EasyRTC server
	rtc = easyrtc.listen(app, socketServer);

	io.sockets.on('connection', function(socket){//Similar to document.ready when the socket initialized
		socket.on('ON_SOCKET_INIT', function(data){
			console.log(data);
		});
	});

	/*function setUpSSLServer() {
	    fs.readFile("./key.pem", "utf8", function(err, data) {
	        fs.readFile("./cert.pem", "utf8", function(err, _data) {
		        httpsOptions = {
				  key: data,
				  cert: _data
				}
				server = https.createServer(httpsOptions, app);
				io = require("socket.io").listen(server);
				socketServer = io.listen(server, {"log level":1});
				// Start EasyRTC server
				rtc = easyrtc.listen(app, socketServer);
				
				io.sockets.on('connection', function(socket){//Similar to document.ready when the socket initialized
					socket.on('ON_SOCKET_INIT', function(data){
						console.log(data);
					})
				})
	    	});
	    });
	}
	setUpSSLServer();*/


	
app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
   res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type,Cache-Control");
   if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  } else {
    return next();
  }
});

// routes ======================================================================
	require('./js/datamodel/userinfohandler.js')(app);
	require('./js/datamodel/mediauploader.js')(app);
    require('./js/datamodel/GeneralDataSet.js')(app);
    require('./js/datamodel/profilehandler.js')(app);
	require('./js/datamodel/friendshandler.js')(app);
	require('./js/datamodel/searchhandler.js')(app);
	//require('./js/datamodel/chathandler.js')(app);
    
// require('./model/FeedHandler.js')(app);
// require('./model/AlbumHandler.js')(app);

//console.log("App listening on port " + port);