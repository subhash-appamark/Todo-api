var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250] //only valid if the length is minimum 1 to max 250 letters
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});
//sequelize.sync({force: true}) --this is to force recreation of all tables when a mistake is done on the schema
sequelize.sync().then(function () {
	console.log('Everything is synced');

	Todo.create ({
		description: 'Wakeup early today',
		completed: false
	}).then(function(todo) {
		return Todo.create({
			description: 'Clean office'
		});
	}).then(function(todo) {
		//return Todo.findById(1)
		return Todo.findAll({
			where: {
				completed: false,
				description: {
					$like: '%today%'
				}
			}
		});
	}).then(function (todos) {
		if(todos) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		} else {
			console.log("No todo found");
		}
	}).catch(function(e) {
		console.log(e);
	})
});