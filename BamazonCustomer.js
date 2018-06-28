var mysql = require('mysql');
var password = require('./password.js');
var prompt = require('prompt');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'bamazon'
});

connection.connect();
prompt.start();

console.log("Welcome to the Smelly Palace!");
console.log("We make this stuff right here!");

// Selecting everything from the products table.
connection.query('SELECT * FROM products', function(err, rows) {
	if (err) throw err;
	// Log all the items for sale to the console.
	for (var i = 0; i < rows.length; i++) {
		console.log("Item ID: " + rows[i]. item_id + " Name: " + rows[i].product_name + " Price: $" + rows[i].Price);
	};
	var schema = {
		properties: {
			 item_id: {
				description: 'What is the ID of the product you want?'
			},
			quantity: {
				description: 'How many would you like?'
			}
		}
	}
	// Ask the user what they want to buy and how much.
	prompt.get(schema, function(err, result) {

		if (rows[result. item_id - 1].stock_quantity < result.quantity) {
			console.log("Insufficient Quantity");
		} else {
			// Total the amount for the user.
			var price = (rows[result. item_id-1].Price * result.quantity);
			var department = rows[result. item_id-1].department_name;
			console.log("Yerp we can do that!");
			console.log("Your order costs: $" + price);
			console.log("Thanks for shopping at Kevin's Store!");

			// Update the total sales for the department.
			connection.query('SELECT * FROM Departments', function(err, rows){
				connection.query('UPDATE Departments SET TotalSales = TotalSales + ' + price + ' WHERE department_name ="' + department + '"', function(err, res){
					if (err) throw err;
				});	
			});
			
			// Update the stock for the item.
			var newQuantity = ( rows[result. item_id - 1].stock_quantity - result.quantity);
			connection.query('UPDATE products SET stock_quantity=' + newQuantity + ' WHERE  item_id=' + result. item_id + ';', function(err, res) {
				if (err) throw err;
			});

		};
	});
});
