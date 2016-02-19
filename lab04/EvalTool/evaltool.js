var nodemailer = require('nodemailer'); //for sending the quiz score via email
var smtpTransport = nodemailer.createTransport(); //
/**
 * Constructor for a Question object.
 *
 * @param text - the text for the actual question.
 * @param choices - an array of all of the answers to choose from
 * @param img (optional) - the link to the image for the question
 */
function Question(text, choices, img) {
	this.text = text;
	this.choices = choices;
	if (img)
		this.img = img;
}

/**
 * The list of all of the questions.
 */
var questions = [
	new Question("What is the correct syntax to change the content of this element below:",
		['document.getElementByName("p").innerHTML = "Hello World!";',
		 '#demo.innerHTML = "Hello World!";',
		 'document.getElement("p").innerHTML = "Hello World!";',
		 'document.getElementById("demo").innerHTML = "Hello World!";'],
		 'Q1.png'),
	new Question("How do you round the number 17.6 to the nearest integer?",
		['round(17.6)',
		 'Math.round(17.6)',
		 'rnd(17.6)',
		 'Math.rnd(17.6)']),
	new Question("How can you detect the user's browser name?",
		['browser.name',
		 'user.navName',
		 'navigator.appName']),
	new Question("What is the output of the following:",
		['false',
		 'true',
		 'error',
		 'undefined',
		 'no output'
		],
		'Q4.png'),
	new Question('What is the output of the following:',
		['1',
		 '3',
		 '21',
		 '"21"'],
		 'Q5.png'),
	new Question("How do you properly set a port for a node webserver to run?",
		["server.port(8080, '127.0.0.1');",
		 "server.host(8080, '127.0.0.1');",
		 "server.listen(8080, '127.0.0.1');",
		 "server.host('127.0.0.1', 8080);"]),
	new Question("What is the output of the following:",
		['true',
		 'false',
		 'error',
		 'undefined'],
		 'Q7.png'),
	new Question("What is the output of the following:",
		['true',
		 'false',
		 'undefined',
		 'NaN'],
		 'Q8.png'),
	new Question("How do you open a second Web browser window?",
		['document.openWin("http://www.google.com/")',
		 'window.open("http://www.google.com/")',
		 'document.open("http://www.google.com/")',
		 'document.location("http://www.google.com/"']),
	new Question("Which of the following will detect which DOM element has focus?",
		['document.activeElement',
		 'document.activeListener',
		 'window.activeElement',
		 'document.getElement'])
];

/**
 * The list of all the answers for the question.
 */
 var answers = [3, 1, 2, 1, 1, 2, 1, 1, 2, 1];

 /**
 * Determines the number of answers the user guessed correctly and
 * adds it to the cookie.
 */
function grade(req, res) {
	var correct = 0;
	for (var i = 0; i < answers.length; i++)
		if (getValue(i + 1, req.headers) == answers[i])
			correct++;
		//else
			//console.log(i + " " + getValue(i + 1, req.headers) + " " + answers[i]);

	// Add the correct count to the cookie.
	res.cookie("correct", correct);
}

/**
 * Retrieves the value for the specified key from the
 * cookie.
 *
 * @param key - the key to search for in the list of cookies
 * @param cookieSource (optional) - the object that contains the cookie
 *									variable (default is document)
 */
 function getValue(key, cookieSource){
	var source = cookieSource || document;

	// Break the cookie string into an array of cookies.
	var cookies = source.cookie.split('; ');
	for (var i = 0; i < cookies.length; i++) {
		// Break the cookie into its key and value.
		var cookie = cookies[i].split('=');
		// Check if the key is the one we are looking for.
		if (cookie[0] == key)
			return decodeURIComponent(cookie[1]);
	}
}

/**
 * Used for retrieving the webpage and initializing the cookie.
 */
function gettool(req, res) {
	// Retrieve the path.
	var filename = gettool.root + req.path;

	// Check if the quiz is being asked for.
	if (req.path == "/EvalTool/evaltool.html") {
		// Check if the quiz has not already been started.
		if (!req.headers.cookie || !getValue("question", req.headers)) {
			// Set the current question number.
			res.cookie("current", 1);
			// Set the current question.
			res.cookie("question", JSON.stringify(questions[0]));
			// Set the total question number.
			res.cookie("total", questions.length);

			// Add a cookie for every question.
			for (var i = 1; i <= questions.length; i++) 
				res.cookie(i, -1);
		}

		// If the quiz is already started, check if it has been completed.
		else if (getValue("completed", req.headers)) {
			grade(req, res);
			filename = gettool.root + "/Evaltool/evaluation.html";
		}
	}

	// console.log(req.path)
	// console.log("/EvalTool/evaluation.html")
	// console.log(req.path == "/EvalTool/evaluation.html")
	// Grade the quiz if the user is accessing the evaluation page.
	if (req.path == "/EvalTool/evaluation.html")
		grade(req, res);

	res.sendFile(filename, function(err) {
		// Log any error.
		if (err) {
			console.log(err);
			// Set the error status for the client and end.
			res.status(err.status).end();
		}

		// If there was no error...
		else {
			// Log the name of the file that was successfully sent.
			console.log("Sent:", req.path);
		}
	});
}

/**
 * Used for retrieving form submissions and modifying the cookies.
 */
function posttool(req, res) {
	// Get the answer to the current question from the form and store it in the cookie.
	var current = Number(getValue("current", req.headers));
	res.cookie(current, req.body.answer);

	// Determine what to do based on which button was pressed.
	var isNext = false;
	switch (req.body.submitButton) {
		// Change to the next/previous question as necessary.
		case "next":
			isNext = true;
		case "prev":
			// Set the current question to the next/previous question.
			current += isNext ? 1 : -1;
			res.cookie("current", current);

			// Set the new question.
			res.cookie("question", JSON.stringify(questions[current - 1]));

			// Reload the page.
			res.redirect('back');
			break;
		case "submit":
			// Add an indicator that the quiz is completed.
			res.cookie("completed", true);
			// Redirect the client to the evaluation page.
			res.redirect('evaluation.html');
			break;
		default: 
			res.status(400).send("<html><body><h1>Error(400): Invalid request.</h1><body><html>");
	}
}

function mailtool(req, res)  {
	var mymail = {};
	// Set the sender's and recipients' address.
	mymail['from'] = req.body.sender_name+"<"+req.body.sender_email+">";
	mymail['to'] = req.body.recipient_name+"<"+req.body.recipient_email+">";
	mymail['subject'] = req.body.subject;

	// Set the content of the message to "[sender's name] scored [correct]/[total] on the Netcentric javascript quiz."
	mymail['text'] = req.body.sender_name + " scored " + getValue("correct", req.headers) + "/" + getValue("total", req.headers) + " on the Netcentric javascript quiz.";

	// Send the email:
	smtpTransport.sendMail(mymail, function(error, info){
	   if(error){
		   console.log(error);
		   res.cookie("messageStatus", "fail");
		   res.redirect('evaluation.html');
	   }else{
		   console.log("Message sent: " + info.response);
		   res.cookie("messageStatus", "success");
		   res.redirect('evaluation.html');
	   }
	});
}

// Add the functions to the module.
exports.gettool = gettool;
exports.posttool = posttool;
exports.mailtool = mailtool;