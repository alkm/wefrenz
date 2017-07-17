var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();

    app.get('/', function (req, res) {
    res.send("hello");
    });

https.createServer({
      key: fs.readFileSync('key.pem'),
      cert: fs.readFileSync('cert.pem')
    }, app).listen(3000);