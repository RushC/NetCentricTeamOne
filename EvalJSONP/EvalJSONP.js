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
 * Used for handling GET requests.
 */
function gettool(req, res) {
	// Retrieve the userID from the query.
	var userID = req.query.userID;

	switch (req.path) {
		case "/EvalJSONP/getID":
			res.jsonp(JSON.stringify(addUser())); //add the user and send them their ID
			break;
		case "/EvalJSONP/first":
			updateUser(req.query.userID, req.query.answer, "first");
			sendQuestion(userID, res, "first");
			break;
		case "/EvalJSONP/next":
			updateUser(req.query.userID, req.query.answer, "next");
			sendQuestion(userID, res, "next");
			break;
		case "/EvalJSONP/previous":
			updateUser(req.query.userID, req.query.answer, "previous");
			sendQuestion(userID, res, "previous");
			break;
		case "/EvalJSONP/last":
			updateUser(req.query.userID, req.query.answer, "last");
			sendQuestion(userID, res, "last");
			break;
		default:
			// Retrieve the file path.
			var filename = gettool.root + req.path;

			// Send the file as a response.
			res.sendfile(filename, function(err) {
				// Log any error.
				if (err) {
					console.log(err);
					res.status(err.status).end();
				}
				else
					console.log("Sent " + filename);
			});
			break;
	}
}

/**
 * Used for handling POST requests.
 */
function posttool(req, res) {    
    // Determine what is being posted.
	switch (req.path) {
        // Posted when the quiz is complete and should be graded.
        case "/EvalJSONP/submitQuiz":
            // Check if one last answer was submitted.
            if (req.body.answer)
                updateUser(req.body.userID, req.body.answer, "first");
            
            // Grade the specified user's quiz.
            var grade = users[req.body.userID].grade();
            
            // Send back the user's grade.
            res.send(grade.toString()).status(200).end();
            break;
            
        // Posted when an email should be sent.
        case "/EvalJSONP/sendMail":
            var mymail = {};
            // Set the sender's and recipients' address.
            mymail['from'] = req.body.sender_name+"<"+req.body.sender_email+">";
            mymail['to'] = req.body.recipient_name+"<"+req.body.recipient_email+">";
            mymail['subject'] = req.body.subject;

            // Set the content of the message to "[sender's name] scored [correct]/[total] on the Netcentric javascript quiz."
            mymail['text'] = req.body.sender_name + " scored " + users[req.body.userID].correct + "/" + questions.length + " on the Netcentric javascript quiz.";

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
            break;
        
        // Invalid post handler.
		default:
			console.log("Some noob can't use the internets lol");
			res.status(400).end();
	}
};

function updateUser(userID, answer, direction) {
	//first save the answer for the current question:
	if (answer) {
		users[userID].answers[users[userID].currentQuestion - 1] = answer;
	}
	//now set the current question based on the direction:
	switch (direction) {
		case "first":
			users[userID].currentQuestion = 1;
			break;
		case "next":
			users[userID].currentQuestion++;
			if (users[userID].currentQuestion > questions.length)
				users[userID] = questions.length;
			break;
		case "previous":
			users[userID].currentQuestion--;
			if (users[userID].currentQuestion < 1)
				users[userID].currentQuestion = 1;
			break;
		case "last":
			users[userID].currentQuestion = questions.length;
			break;
		default:
			console.log("WTF>>>\n\n\n\n\n\n\n\n\n\n\n<<<SOME KIND OF SHIT WENT DOWN HERE");
	}

}

function sendQuestion(userID, res) {
	//create the send obj with the question and the users answer (if there is one):
	var sendObj = {};
	sendObj.question = questions[users[userID].currentQuestion - 1];
	sendObj.currentAnswer = users[userID].answers[users[userID].currentQuestion - 1];
	sendObj.questionNumber = users[userID].currentQuestion;
	sendObj.questionTotal = questions.length;
	//send the JSON notation for the sendObj as a response:
	res.jsonp(JSON.stringify(sendObj));	
}

//constructor for user object:
function User() {
	this.currentQuestion = 1; //question of the quiz the user is viewing
	this.answers = []; //answers to the questions submitted by the user
    
    /**
     * Determines how many answers the user had correct and adds the
     * numberCorrect property to the user.
     *
     * @param correctAnswers (required) - the array of correct answers
     * @returns - the number of answers the user had correct.
     */
    this.grade = function() {
        // Add the correct property to the object.
        this.correct = 0;
        
        // Iterate through all of the correct answers.
        for (var i = 0; i < answers.length; i++)
            // Compare the user's answer to the correct answer.
            if (this.answers[i] == answers[i])
                this.correct++;
            
        return this.correct;
    }
}

//object holding all the users:
var users = {};
var lastID = 0; //last ID assigned to a user

//add a new user to users and return the id of the new user:
function addUser() {
	 users[++lastID] = new User();
	 return lastID;
}

exports.gettool = gettool;
exports.posttool = posttool;