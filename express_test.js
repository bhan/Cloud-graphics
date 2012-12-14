var express = require('express');
var port = 8081;

var app = express();

app.use(express.static(__dirname + '/public'));

app.get('/cloth', function(req, res) {
	console.log("Request: " + req["url"]);
	res.send({"url": req["url"]});
});

app.listen(port);
console.log("Listening on port 8081");
