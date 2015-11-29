var express = require("express");
var bodyParser = require("body-parser");
var _= require("underscore");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

//var middleware = require("./middleware.js");
//app.use(middleware.logger);

//todos collection
/*var todos = [{
	id: 1,
	description: "Take family for lunch",
	completed: false
}, {
	id: 2,
	description: "Go to Market",
	completed: false
}, {
	id: 3,
	description: "Fill Gas on Honda",
	completed: true
}];

app.get('/', function (req, res) {
	res.send("TODO API Root!");
});*/

var todos = [];
var todoNextId = 1;


//GET todo list 
app.get('/todos', function (req, res) {
	res.json(todos);
});

//GET todo list 
app.get('/todos/:id', function (req, res) {
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoid});

	/*
	---old code
	var matchedtodo;
	todos.forEach(function (todo) {
		if (todoid === todo.id) {
			matchedtodo = todo;
		}
	});
	*/

	if (matchedtodo) {
		res.json(matchedtodo);
	} else {
		//to send 404
		res.status(404).send();
	}
	
});

//POST Testing
app.post('/todos', function (req, res) {
	var body = _.pick(req.body,'description','completed');

	body.description = body.description.trim();

	if (!_.isBoolean(body.completed) || 
		!_.isString(body.description) || 
		body.description.trim().length === 0) {
		return res.status(400).send();
	}

	body.id = todoNextId++;
	todos.push(body);

	res.json(todos);
	
});

app.delete('/todos/:id', function(req,res) {
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoid});

	if(!matchedtodo) {
		return res.status(400).json({"error":"No todo found with this id."});
	} else {
		todos = _.without(todos,matchedtodo);
		res.json(matchedtodo);
	}

	
});

app.listen(PORT, function () {
	console.log("Express server started on " + PORT + " !!!");
});
