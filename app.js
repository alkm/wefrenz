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

var chatBuddiesConnected = [];
var chatClients = {};
var chatBuddies = [];
// list of socket ids
var clients = [];
var usedSockets = {};

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json({limit: '50mb'}));

var session = require('express-session');
var ssn ;
app.use(session({secret:'0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK', resave: false, saveUninitialized: true}));

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
	//var httpsOptions = {};

	//var https = require('https');
	var http = require('http');
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
	//var server = https.createServer(httpsOptions, app).listen(port);
	var server = http.createServer(app).listen(port);
	var io = require("socket.io").listen(server);
	var socketServer = io.listen(server, {"log level":1});
	// Start EasyRTC server
	var rtc = easyrtc.listen(app, socketServer);

	//Handling the chat on socket
	io.sockets.on('connection', function(socket){//Similar to document.ready when the socket initialized
		socket.on('ON_SOCKET_INIT', function(data){
			socket.userid = data.userid;
			handleActiveUsers(socket, data.userid);
		});
		socket.on('ON_SEND_MSG', function(data){
			//Emitting the info back to client 
			//io.sockets.emit("ON_NEW_MSG", data);//To all users connected in socket
			
			var receiverSocket = usedSockets[data.chatid];
			console.log('dreceiverSocket'+receiverSocket);
			try{
				receiverSocket.emit("ON_NEW_MSG", data);//To specific user to whom message is sent
			}catch(err){
				console.log('socket error');
			}
		});


		socket.on('disconnect', function(data){
			handleClientDisconnected(socket, socket.userid);
			console.log(socket.userid+' is disconnected');
			//Set user appearance status in db
			/*userInfo.update({_id : socket.userid}, { $set: {appearance: "offline"}}, function(error, docs){
				if(error){
					console.log("Error"+error);
				}else{
					io.sockets.emit("UPDATE_CHAT_LIST", "");
				}
			});*/
		});
	});

	function handleActiveUsers(socket, userid){
		//Saving all the users connected in socket
		for(var i = 0; i < chatBuddiesConnected.length ; i++){
			if(userid === chatBuddiesConnected[i]){
				console.log("Looks like you are already connected");
				return;
			}
		}
		
		chatBuddiesConnected.push(userid);
		chatClients[socket.userid] = userid;
		usedSockets[userid] = socket;
	}
	function handleClientDisconnected(socket, userid){
		console.log("disconnected");
		console.log(chatClients[socket.userid]);
		chatBuddiesConnected.splice(0,chatClients[socket.userid]); 
		var indx = chatBuddiesConnected.indexOf(chatClients[socket.userid]);
		if(indx != -1){
			chatBuddiesConnected.splice(indx, 1);
		} 
		
		delete usedSockets[userid];
		for(var i in chatClients){
			console.log(i);
		}

		delete chatClients[socket.userid];
		for(var i in chatClients){
			console.log(i);
		}
		console.log(chatBuddiesConnected);
	}

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
   res.header("Access-Control-Allow-Headers", "X-Requested-With, authorization, Content-Type,Cache-Control");
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
	require('./js/datamodel/chathandler.js')(app);
    
// require('./model/FeedHandler.js')(app);
// require('./model/AlbumHandler.js')(app);

//console.log("App listening on port " + port);