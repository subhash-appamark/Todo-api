var express = require("express");
var bodyParser = require("body-parser");
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
	var matchedtodo;

	todos.forEach(function (todo) {
		if (todoid === todo.id) {
			matchedtodo = todo;
		}
	});

	if (matchedtodo) {
		res.json(matchedtodo);
	} else {
		//to send 404
		res.status(404).send();
	}
	
});

//POST Testing
app.post('/todos', function (req, res) {
	var body = req.body;

	/* 
	var todo = {};
	todo.id = todoNextId;
	todo.description = body.description;
	todo.completed = body.completed;
	todos.push(todo);
	todoNextId++;
	res.json(todo);
	*/
	//OR

	body.id = todoNextId++;
	todos.push(body);
	
	res.json(todos);
	
});

app.listen(PORT, function () {
	console.log("Express server started on " + PORT + " !!!");
});
