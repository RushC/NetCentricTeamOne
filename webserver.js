var express = require('express');
var fs = require('fs');
var bodyParser  = require('body-parser');

var ChatServer  = require('./CloudChat/ChatServer');
var syllabus  = require('./Syllabus/syllabus');
var evaltool  = require('./EvalTool/evaltool');
var evalJSONtool = require('./EvalJSONP/EvalJSONP.js');
var schedule = require('./Schedule/schedule.js');
var canvasanimation = require('./CanvasAnimation/tool.js');
var lecturenotes = require('./LectureNotes/tool.js');
var services = require('./Services/tool.js');
var amazon = require('./AmazonBook/tool.js');
var showandtell = require('./ShowAndTell/tool.js');

//setup the root path
var root = __dirname;
ChatServer.gettool.root = root;
syllabus.gettool.root = root;
evaltool.gettool.root = root;
evalJSONtool.gettool.root = root;
schedule.gettool.root = root;
canvasanimation.gettool.root = root;
lecturenotes.gettool.root = root;
services.gettool.root = root;
amazon.gettool.root = root;
showandtell.gettool.rot = root;

var app     = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '50mb'
}));
app.set("jsonp callback", true);

app.get('/', function (req, res) {
	fs.readFile('home.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/about.html', function (req, res) {
	fs.readFile('about.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});
app.get('/side.html', function (req, res) {
	fs.readFile('side.html', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/clock.js', function (req, res) {
	fs.readFile('clock.js', 'utf8', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/clockBG.png', function (req, res) {
	fs.readFile('clockBG.png', function (err,data) {
		if (err) {
			return console.log(err);	
		}
	res.send(data);
	});	
});

app.get('/ThreeRegion/*', threeregion);
function threeregion(req, res) {
	var fileName = root +req.path;
	  res.sendFile(fileName, function (err) {
	    if (err) {
	      console.log(err);
	      res.status(err.status).end();
	    }
	    else {
	      console.log('Sent:', req.path);
	    }
	  });
}

app.get('/WebRoster/Roster.jsp', function(req, res) {
	res.redirect("http://localhost:8080/WebRoster/Roster.jsp");
});

app.get('/ShowAndTellProject', function(req, res) {
    
	res.redirect("http://localhost:8080/ShowAndTellProject/");
});

// Specify GET tools.
app.get('/CloudChat/*', ChatServer.gettool);
app.get('/Syllabus/*', syllabus.gettool);
app.get("/EvalTool/*", evaltool.gettool);
app.get("/EvalJSONP/*", evalJSONtool.gettool);
app.get("/Schedule/*", schedule.gettool);
app.get("/CanvasAnimation/*", canvasanimation.gettool);
app.get("/LectureNotes/*", lecturenotes.gettool);
app.get("/Services/*", services.gettool);
app.get("/AmazonBook/*", amazon.gettool);
app.get("/ShowAndTell/*", amazon.gettool);

// Specify POST tools.
app.post("/EvalTool/eval*", evaltool.posttool);
app.post("/EvalTool/sendMail", evaltool.mailtool);
app.post("/EvalJSONP/*", evalJSONtool.posttool);
app.post("/AmazonBook/*", amazon.posttool);


app.listen(8888, function() {
  console.log('Server running at http://127.0.0.1:8888/');
});
