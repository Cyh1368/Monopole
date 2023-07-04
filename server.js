var mysql = require('mysql');
var http = require('http');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const path = require('path');
// var formidable = require('formidable');
var fs = require('fs');
const app = express();
const authExpire = 2 * 60; // Two minutes for developement stage, in SECONDS
const cookieLength = 10 * 60 * 1000; // 10 min, in milliseconds
const cryptoKey = "kA94fp@ki/2[]`jr-=`]"; // Should be kept secret in some way

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ch122iv0Console.log",
  database: "Monopole"
});

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/pdfs', function(request, response) {
    response.sendFile(path.join(__dirname + '/pdfs.html'));
});

app.get('/monopole', function(request, response) {
    response.sendFile(path.join(__dirname + '/monopole.html'));
});

app.get('/monopoleLogin', function(request, response) {
	console.log(__dirname);
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/monopoleSignup', function(request, response) {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

app.get('/monopoleAsk', function(request, response) {
    response.sendFile(path.join(__dirname + '/ask.html'));
});

app.post('/auth', function(request, response) {
    console.log("Authentication Start")
	// Capture the input fields
    // console.log(request)
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		var hmacPassword = crypto.createHmac('sha256', cryptoKey).update(password).digest('hex');
		// Execute SQL query that'll select the account from the database based on the specified username and password
		connection.query('SELECT * FROM logintb WHERE Username = ? AND Passwd = ?', [username, hmacPassword], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
                console.log("Auth result is not null")
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page\
                console.log("Response as follows:");
                console.log(response);

				// Update "expireTime" column
				var current = Math.floor(Date.now() / 1000); // Storing the "seconds"
				var expire = (current + authExpire) % 2147483647; // In "seconds", since millisecond accuracy is waste of database
				// To prevent overflow, I take the modulus, though this may have a bug of 2147483647s period.

				console.log("Expire time: ", expire);
				connection.query('UPDATE logintb SET expireTime = ? WHERE Username = ?', [expire, username], function(error, results, fields){
					if (error) throw error;
				});
				
				// // Store username in cookie, then check the expire time in mysql
				// var d = new Date();
				// d.setTime(d.getTime() + (cookieLength));
				// let cookieExpires = "expires="+d.toUTCString();
				// document.cookie = "username" + "=" + username + ";" + cookieExpires + ";path=/";


				response.redirect('/monopole');
                console.log("Directed home.");
                
			} else {
				response.send('Incorrect Username and/or Password!');
                response.end();
			}
		});
	} else {
		response.send('Please enter Username and Password!');
        response.end();
	}
});


// http://localhost:3000/auth
app.post('/register', function(request, response) {
    console.log("Registration Start")
	// Capture the input fields
	let username = request.body.username;
	let password1 = request.body.password1;
	let password2 = request.body.password2;
    console.log("Registering with " + username + ", " + password1 + ", " + password2);
	// Ensure the input fields exists and are not empty
	if (username && password1) {
		if (password1!=password2){
			response.send("The two password fields are not same. Check again.");
			response.end();
		} else {
			var password = password1;
			var hmacPassword = crypto.createHmac('sha256', cryptoKey).update(password).digest('hex');
			var sql = 'INSERT INTO logintb (Username, Passwd) VALUES ("' + username + '", "' + hmacPassword + '");';
			// Execute SQL query that'll select the account from the database based on the specified username and password
			connection.query(sql, function(error, results, fields) {
				// If there is an issue with the query, output the error
				if (error){
					// console.log("ERROR in register()");
					throw error;
				} 
				console.log("Result is", results)
				if (results.serverStatus==2) {
					response.send("Registration completed! <a href='/monopoleLogin'>Login</a> here." )
					
				} else {
					response.send('Registration somehow failed. It has something to do with the server though, not your fault.');
					response.end();
				}
			});
		}
	} else {
		response.send('Please enter Username and Password!');
        response.end();
	}
});

app.listen(8080);

// http.createServer(function (req, res) {
//   if (req.url == '/fileupload') {
//     var form = new formidable.IncomingForm();
//     form.parse(req, function (err, fields, files) {
//       var oldpath = files.filetoupload.filepath;
//       var newpath = 'C:/Users/cheng/' + files.filetoupload.originalFilename;
//       fs.rename(oldpath, newpath, function (err) {
//         if (err) throw err;
//         res.writeHead(200, {'Content-Type': 'text/html'});
//         res.write('File uploaded and moved!');
//         res.end();
//       });
//     });
//   } else {
    // fs.readFile('main.html', function (err, data){
    //     res.writeHead(200, {'Content-Type': 'text/html'});
    //     res.write(data);
    //     return res.end();
    // })
//   }
// }).listen(8080);