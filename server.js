var mysql = require('mysql');
var http = require('http');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const path = require('path');
const store = require('store');
var localStorage = require('localStorage');
var cookies = require("cookie-parser");
// var formidable = require('formidable');
var fs = require('fs');
const { log } = require('console');
const app = express();
const authExpire = 2 * 60; // Two minutes for developement stage, in SECONDS
const cookieLength = 10 * 60 * 1000; // 10 min, in milliseconds
const cryptoKey = "kA94fp@ki/2[]`jr-=`]"; // Should be kept secret in some way

async function authLoginToken(token){
	// Input: login token, both stored in the client cookie and database
	// Output: Matching user name, null otherwise
	var ret = undefined;
	let sqlPromise = new Promise(function(resolve) {
		connection.query('SELECT Username FROM logintb WHERE loginToken = ?', [token], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// console.log("AUTHTOKEN result: ", results);
			var string=JSON.stringify(results);
			var json =  JSON.parse(string);
			// console.log("AUTH json: ", json)
			if (json[0]!=undefined) ret = json[0].Username;
			resolve(ret);
			// console.log("RET: ", ret);
		});
	});
	let promiseValue = await sqlPromise;
	// console.log("Promise value: ", promiseValue);
	return promiseValue;
}


// Store a random key both in the database and client side (session). 
// Upon login attempt, check if session token matches a user. Then check if user is logged in.
var generate_key = function() {
    // 16 bytes is likely to be more than enough,
    // but you may tweak it to your needs
    return crypto.randomBytes(20).toString('base64');
};

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

app.use(cookies());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(request, response) {
	// console.log("Return of auth: ", authLoginToken(request.cookies.clientToken));
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/home.html'))
		// console.log("IIFE log: ", authResult);
	})()

	// console.log(authLoginToken("blah"));
	// console.log(request.cookies);
    // response.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/pdfs', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/pdfs.html'))
	})()
	// console.log("IIFE log: ", authResult);
});

app.get('/monopole', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/monopole.html'))
	})()
});

app.get('/monopoleLogin', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/login.html'))
	})()
});

app.get('/monopoleSignup', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/signup.html'))
	})()
});

app.get('/monopoleAsk', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
		response.sendFile(path.join(__dirname + '/ask.html'))
	})()
});

app.post('/auth', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
	})()

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

				var loginToken = generate_key()
				console.log("Login token: ", loginToken);
				connection.query('UPDATE logintb SET loginToken = ? WHERE Username = ?', [loginToken, username], function(error, results, fields){
					if (error) throw error;
				});

				// // Store token client-side
				// var client = {clientToken: loginToken};
				// localStorage.setItem('clientToken', JSON.stringify(client));
				
				// // Store username in cookie, then check the expire time in mysql
				// var d = new Date();
				// d.setTime(d.getTime() + (cookieLength));
				// let cookieExpires = "expires="+d.toUTCString();
				// document.cookie = "username" + "=" + username + ";" + cookieExpires + ";path=/";

				response.cookie("clientToken", loginToken);
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
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response.cookie("clientUsername", authResult);
	})()

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