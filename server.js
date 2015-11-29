var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;

//var middleware = require("./middleware.js");

//app.use(middleware.logger);

app.get('/', function (req, res) {
	res.send("TODO API Root!");
});

app.listen(PORT, function () {
	console.log("Express server started on " + PORT + " !!!");
});
