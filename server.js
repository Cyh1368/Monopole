var mysql = require('mysql');
var http = require('http');
const crypto = require('crypto');
const express = require('express');
const session = require('express-session');
const path = require('path');
var localStorage = require('localStorage');
var cookies = require("cookie-parser");
// var formidable = require('formidable');
var fs = require('fs');
const { log } = require('console');
const app = express();
const authExpire = 2 * 60; // Two minutes for developement stage, in SECONDS
const cookieLength = 24 * 60 * 60 * 1000; // 24 hr, in milliseconds
const cryptoKey = "kA94fp@ki/2[]`jr-=`]"; // Should be kept secret in some way

const questionCategories = ["me", "em", "th", "ap", "sr", "gr", "mo"];
const port=3000;
const hostname = '0.0.0.0'; // Bind to all available network interfaces
const databasePassword = "Ch122iv0Console.log"; // Change this in server. In case you're a hacker, this is not the server password. Quit intercepting it on Github.

async function authLoginToken(token){
	// Input: login token, both stored in the client cookie and database
	// Output: Matching user name, null otherwise
	var ret = {UserID: undefined, Username: undefined};
	let sqlPromise = new Promise(function(resolve) {
		connection.query('SELECT UserID, Username FROM logintb WHERE loginToken = ?', [token], function(error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			//console.log("AUTHTOKEN result: ", results);
			var string=JSON.stringify(results);
			var json =  JSON.parse(string);
			//console.log("AUTH json: ", json)
			if (json[0]!=undefined) ret.UserID = json[0].UserID;
			if (json[0]!=undefined) ret.Username = json[0].Username;
			
			resolve(ret);
			//console.log("RET: ", ret);
		});
	});
	let promiseValue = await sqlPromise;
	//console.log("Promise value: ", promiseValue);
	return promiseValue;
}

function secondsToUTC(inputSec){
	let d = new Date(inputSec*1000);
	return d.toUTCString();
}

function setResponseCookies(res, jsonData){
	let now = new Date();
	let time = now.getTime();
	let expireTime = time + cookieLength;
	now.setTime(expireTime);
	res.cookie('clientUserID', jsonData.UserID, {
		expires: now, // There's maybe a bug here because there's language-dependent result here like 台北標準時間
		secure: false,
		httpOnly: false, // As of 20230710 client-side js can't access cookie if set to true, making it less secure
		sameSite: 'lax'
	});
	res.cookie('clientUsername', jsonData.Username, {
		expires: now, // There's maybe a bug here because there's language-dependent result here like 台北標準時間
		secure: false,
		httpOnly: false, // As of 20230710 client-side js can't access cookie if set to true, making it less secure
		sameSite: 'lax'
	});
	return res;
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
  password: databasePassword, 
  database: "monopel"
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

app.get('/cyh', function(request, response) {
	//console.log("Return of auth: ", authLoginToken(request.cookies.clientToken));
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/cyh.html'))
		//console.log("IIFE log: ", authResult);
	})()

	//console.log(authLoginToken("blah"));
	//console.log(request.cookies);
    // response.sendFile(path.join(__dirname + '/home.html'));
});

app.get('/pdfs', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/pdfs.html'))
	})()
	//console.log("IIFE log: ", authResult);
});

app.get('/', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/monopel.html'))
	})()
});

app.get('/monopel', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/monopel.html'))
	})()
});

app.get('/monopelJoin', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/join.html'))
	})()
});

app.get('/about', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/join.html'))
	})()
});

app.get('/monopelLogin', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/login.html'))
	})()
});

app.get('/monopelSignup', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/signup.html'))
	})()
});

app.get('/monopelAsk', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/ask.html'))
	})()
});

app.get('/questions', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		response.sendFile(path.join(__dirname + '/questions.html'))
	})()
});

app.post('/auth', function(request, response) {
	let authResult;
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
	})()

    //console.log("Authentication Start")
	// Capture the input fields
    //console.log(request)
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
                //console.log("Auth result is not null")
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page\
                //console.log("Response as follows:");
                //console.log(response);

				// Update "expireTime" column
				var current = Math.floor(Date.now() / 1000); // Storing the "seconds"
				var expire = (current + authExpire) % 2147483647; // In "seconds", since millisecond accuracy is waste of database
				// To prevent overflow, I take the modulus, though this may have a bug of 2147483647s period.

				//console.log("Expire time: ", expire);
				connection.query('UPDATE logintb SET expireTime = ? WHERE Username = ?', [expire, username], function(error, results, fields){
					if (error) throw error;
				});

				var loginToken = generate_key()
				//console.log("Login token: ", loginToken);
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
				

				// Old method
				// response.cookie('clientToken', loginToken);

				let now = new Date();
				let time = now.getTime();
				let expireTime = time + cookieLength;
				now.setTime(expireTime);
				response.cookie('clientToken', loginToken, {
					expires: now, // There's maybe a bug here because there's language-dependent result here like 台北標準時間
					secure: false,
					httpOnly: false, // So that client can't see the cookie
					sameSite: 'lax'
				});
				response.redirect('/monopel');
                //console.log("Directed home.");
                
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
		response = setResponseCookies(response, authResult);
	})()

    //console.log("Registration Start")
	// Capture the input fields
	let username = request.body.username;
	let password1 = request.body.password1;
	let password2 = request.body.password2;
    //console.log("Registering with " + username + ", " + password1 + ", " + password2);
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
					//console.log("ERROR in register()");
					throw error;
				} 
				//console.log("Result is", results)
				if (results.serverStatus==2) {
					response.send("Registration completed! <a href='/monopelLogin'>Login</a> here." )
					response.end();
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

app.post("/askSubmit", function(request, response){
	let authResult, username="not checked", userid="not checked";
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		username = authResult.Username;
		userid = authResult.UserID;

		//console.log(username, userid)
		if (username=="undefined" || userid=="undefined" || !username || !userid){
			//console.log("Null credentials");
			response.send("You must log in before asking a question. <a href='/monopelLogin'>Login</a> here.");
			response.end();
		} else {
			let body = request.body;
			//console.log("Request body: ", body); // { title: 'ewh', main: 'wehw', mech: '1', sr: '1' }
			let categoryString = "";
			for (category of questionCategories){
				//console.log("cat", category, body[category]);
				if (body[category]) categoryString+=category+"|"
			}
			//console.log(categoryString);

			// Fixing time overflow
			var current = Math.floor(Date.now() / 1000) % 2147483647; // Storing the "seconds"
			// To prevent overflow, I take the modulus, though this may have a bug of 2147483647s period.

			connection.query('INSERT INTO questb (UserID, Username, Title, Main, Categories, AskTime) VALUES (?, ?, ?, ?, ?, ?)', [userid, username, body.title, body.main, categoryString, current], function(error, results, fields){
				if (error) throw error;
				response.send("Question submitted. Return <a href='/monopel'>Home</a>.")
				response.end();
			});
		}
	})()	
})

app.post("/sendComment", function(request, response){
	let authResult, username="not checked", userid="not checked";
	(async () => {
		authResult = await authLoginToken(request.cookies.clientToken)
		response = setResponseCookies(response, authResult);
		username = authResult.Username;
		userid = authResult.UserID;

		//console.log(username, userid);
		if (username=="undefined" || userid=="undefined" || !username || !userid){
			//console.log("Null credentials");
			response.send({'status': 0});
			response.end();
		} else {
			let body = request.body;
			//console.log("Request body: ", body); // { title: 'ewh', main: 'wehw', mech: '1', sr: '1' }
			
			// Fixing time overflow
			var commentTimeSec = Math.floor(body.CommentTime / 1000) % 2147483647;
			// To prevent overflow, I take the modulus, though this may have a bug of 2147483647s period.

			connection.query('INSERT INTO cmntb (QuestionID, UserID, Username, Messege, PostTime) VALUES (?, ?, ?, ?, ?)', [parseInt(body.QuestionID), userid, username, body.Comment, commentTimeSec], function(error, results, fields){
				if (error) throw error;
			});

			response.send({'status': 1});
			response.end();
		}
	})()	
})

app.get('/getRecentQuestions', function(request, response) {
	let clientResult = [];
	connection.query('SELECT * FROM questb ORDER BY AskTime DESC LIMIT 10', null, function(error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		let recentQuestions = results;
		for (item of recentQuestions){
			clientResult.push({
				Username: item.Username,
				Title: item.Title,
				Main: item.Main,
				Categories: item.Categories,
				AskTime: secondsToUTC(item.AskTime),
				QuestionID: item.QuestionID
			});
		}
		//console.log(clientResult);
		response.send(clientResult);
		response.end();
	});
})

app.get('/getQuestionComments', function(request, response) {
	let clientResult = [];
	quesID = request.query.quesid;
	//console.log(quesID);
	connection.query('SELECT * FROM cmntb WHERE QuestionID = ? ORDER BY PostTime DESC LIMIT 20', [quesID], function(error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		let recentComments = results;
		for (item of recentComments){
			clientResult.push({
				Username: item.Username,
				Messege: item.Messege,
				PostTime: secondsToUTC(item.PostTime),
				QuestionID: item.QuestionID
			});
		}
		//console.log("getComments: ", clientResult);
		response.send(clientResult);
		response.end();
	});
})

app.get('/getQuestionByID', function(request, response) {
	let quesID = request.query.quesid;
	let clientResult = [];
	connection.query('SELECT * FROM questb WHERE QuestionID = ? ORDER BY AskTime DESC LIMIT 1', [quesID], function(error, results, fields) {
		// If there is an issue with the query, output the error
		if (error) throw error;
		let item = results[0];
		clientResult = {
			Username: item.Username,
			Title: item.Title,
			Main: item.Main,
			Categories: item.Categories,
			AskTime: secondsToUTC(item.AskTime),
			QuestionID: item.QuestionID
		};
		//console.log("questionR", item);
		//console.log(clientResult);
		response.send(clientResult);
		response.end();
	});
})

app.get('/viewQuestion', function(request, response) {
	let quesID = request.query.quesid;

	if (!quesID){
		response.send("No question ID was received by the server. Return <a href='/monopel'>Home</a>.");
		response.end();
	} else {
		let now = new Date();
		let time = now.getTime();
		let expireTime = time + cookieLength;
		now.setTime(expireTime);

		let authResult;
		(async () => {
			authResult = await authLoginToken(request.cookies.clientToken)
			response = setResponseCookies(response, authResult);
		
			response.cookie('viewQuestionID', quesID, {
				expires: now, // There's maybe a bug here because there's language-dependent result here like 台北標準時間
				secure: false,
				httpOnly: false, // As of 20230710 client-side js can't access cookie if set to true, making it less secure
				sameSite: 'lax'
			});

			response.sendFile(path.join(__dirname + '/viewQuestion.html'))
		})()
	}
})

app.listen(port, hostname, () => {
	console.log(`Server running at http://localhost:${port}`);
});
