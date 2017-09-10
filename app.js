var express = require('express')
var serveStatic = require('serve-static')
var app = express()						// create our app w/ express
var mongoose = require('mongoose'); 				// mongoose for mongodb
var port = process.env.PORT || 3000; 
var database = require('./config/database'); 			// load the database config
var routes = require('routes');
global.nodeEventer = require('node-eventer').init();
var bodyParser = require('body-parser');
var fs = require('fs');
var easyrtc = require("easyrtc"); // EasyRTC external module
var https = require('https');
/*var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};*/

var privateKey  = fs.readFileSync('key.key', 'utf8');
var certificate = fs.readFileSync('cert.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

// app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//app.use(bodyParser.urlencoded({limit: '50mb'}));
const clientSessions = require("client-sessions");
app.use(clientSessions({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // set this to a long random string!
}));

//configuration ===============================================================
//mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io
mongoose.createConnection(database.url, function(err){
	mongoose.Promise = global.Promise;
	if(err){
		console.log(err);
	} else{
		console.log("Connected to mongodb!");
	}
})
	app.set('sslport', 3000);
	app.use(serveStatic(__dirname + '/'))
	app.listen(3000)
	
	// listen (start app with node server.js) ======================================
	//server = require('https').createServer(app, function (req, res) {
	  //	res.writeHead(200);
	  	//res.end("hello world\n");
	  	
		//server.listen(port);
	//}).listen(port);
    server = https.createServer(credentials, app),/*.listen(app.get('sslport'), (req, res) => {
    	console.log('secure server on port', app.get('sslport'));
    }),*/
	io = require("socket.io").listen(server);
	var socketServer = io.listen(server, {"log level":1});
	// Start EasyRTC server
	var rtc = easyrtc.listen(app, socketServer);
	


// routes ======================================================================
	require('./js/datamodel/userinfohandler.js')(app);
	require('./js/datamodel/mediauploader.js')(app);
// require('./model/GeneralDataSet.js')(app);
    require('./js/datamodel/profilehandler.js')(app);
	require('./js/datamodel/friendshandler.js')(app);
	require('./js/datamodel/searchhandler.js')(app);
    require('./js/datamodel/chathandler.js')(app);
// require('./model/FeedHandler.js')(app);
// require('./model/AlbumHandler.js')(app);
  io.sockets.on('connection', function(socket){//Similar to document.ready when the socket initialized
	socket.on('ON_SOCKET_INIT', function(data){
		console.log(data);
	})
  })
//console.log("App listening on port " + port);
