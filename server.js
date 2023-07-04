var http = require('http');
const express = require('express');
const session = require('express-session');
const path = require('path');
// var formidable = require('formidable');
var fs = require('fs');
const app = express();

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

app.get('/monopole/login', function(request, response) {
    response.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/monopole/signup', function(request, response) {
    response.sendFile(path.join(__dirname + '/signup.html'));
});

app.get('/monopole/ask', function(request, response) {
    response.sendFile(path.join(__dirname + '/ask.html'));
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