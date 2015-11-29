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
//GET /todos?completed=false&q=walk
app.get('/todos', function (req, res) {
	var queryParams = req.query;
	var filteredTodos = todos;

	if(queryParams.hasOwnProperty('completed') && 
		queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed : true});
	} else if(queryParams.hasOwnProperty('completed') && 
		queryParams.completed === 'false') {
		filteredTodos = _.where(filteredTodos, {completed : false});
	} 

	if(queryParams.hasOwnProperty('q') && 
		queryParams.q.length > 0) {
		filteredTodos = _.filter(filteredTodos, function (todo) {
			return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredTodos);
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
		return res.status(404).send();
	}

	body.id = todoNextId++;
	todos.push(body);

	res.json(todos);
	
});

app.delete('/todos/:id', function(req,res) {
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoid});

	if(!matchedtodo) {
		return res.status(404).json({"error":"No todo found with this id."});
	} else {
		todos = _.without(todos,matchedtodo);
		res.json(matchedtodo);
	}

	
});

//update
app.put('/todos/:id', function(req,res) {
	var todoid = parseInt(req.params.id, 10);
	var matchedtodo = _.findWhere(todos, {id: todoid});
	if (!matchedtodo) {
		return res.status(404).send();
	}

	var body = _.pick(req.body,'description','completed');
	var validAttributes = {};

	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return res.status(400).send();
	} 

	if (body.hasOwnProperty('description') && 
		_.isString(body.description) && 
		body.description.trim().length > 0) {
		validAttributes.description = body.description;
		body.description = body.description.trim();
	} else if (body.hasOwnProperty('description')) {
		return res.status(400).send();
	} 

	_.extend(matchedtodo, validAttributes);

	res.json(todos);

});

app.listen(PORT, function () {
	console.log("Express server started on " + PORT + " !!!");
});
