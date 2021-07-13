const mysql = require('mysql');
const express = require('express');
const app = express();

app.use(express.static('templates'));
app.use(express.urlencoded({
	extended: true
}));

/* connect to database */
const mysqlParams = {
	host: 'oisjdfosj2292.amazon.rds.com',
	user: 'root',
	password: '',
	database: 'firstdb'
};

const connection = mysql.createConnection(mysqlParams);
connection.connect();

/* set up our routes */
app.get('/users', function(req, res) {
	console.log('page loaded, sending user list');
	connection.query('SELECT id,firstname,lastname,email FROM users', function(err, results) {
		res.json(results);
	});
});

// fetch a single user record and send it back in JSON
app.get('/user/:user_id', function(req, res) {
	connection.query(
		'SELECT id,firstname,lastname,email FROM users WHERE id = ' + req.params.user_id, 
		function(err, results) {
			res.json(results[0]);
	});
});

app.get('/movieList', function(req, res) {
	connection.query('SELECT id,filename,filepath,filetype FROM files', function(err, results) {
		let output = '<ul>';
		for ( var i = 0; i < results.length; i++ ) {
			output += `<li><a href="${results[i].filepath}">${results[i].filename}</a></li>`;
		}
		output += '</ul>';

		res.send(output);

	});
});

app.post('/user', function(req, res) {

	if ( req.body.user_id ) {
		// we are updating
		connection.query(`UPDATE users SET firstname = "${req.body.firstname}", lastname = "${req.body.lastname}", email = "${req.body.email}" WHERE id = ${req.body.user_id}`, function(err, results) {
			res.redirect('/');
		});

	} else {
		// we are creating
		// store user information in database
		connection.query(`INSERT INTO users (firstname, lastname, email) VALUES ("${req.body.firstname}", "${req.body.lastname}", "${req.body.email}")`, function(err, results) {
			if ( err ) {
				res.send(err);
			} else {
				// when that is done, reload the page
				res.redirect('/');
				//res.send(results);
			}
			
		});
	}

	

});

app.listen(3000);