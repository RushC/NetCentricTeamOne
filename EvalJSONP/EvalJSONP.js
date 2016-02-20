/**
 * Used for retrieving the webpage.
 */

function gettool(req, res) {
	switch (req.path) {
		case "/EvalJSONP/getID":
			res.jsonp(JSON.stringify(addUser())); //add the user and send them their ID
			break;
		case "/EvalJSONP/first":
			updateUser(req.query.userID, req.query.answer, "first");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/next":
			updateUser(req.query.userID, req.query.answer, "next");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/previous":
			updateUser(req.query.userID, req.query.answer, "previous");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/last":
			updateUser(req.query.userID, req.query.answer, "last");
			sendQuestion(userID, res);
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

function posttool(req, res) {

	switch (req.path) {
		case "/EvalJSONP/first":
			updateUser(req.query.userID, req.query.answer, "first");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/next":
			updateUser(req.query.userID, req.query.answer, "next");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/previous":
			updateUser(req.query.userID, req.query.answer, "previous");
			sendQuestion(userID, res);
			break;
		case "/EvalJSONP/last":
			updateUser(req.query.userID, req.query.answer, "last");
			sendQuestion(userID, res);
			break;
		default:
			console.log("Some noob can't use the internets lol");
			res.status(400).end();
	}
};

function updateUser(userID, answer) {
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
			++users[userID].currentQuestion;
			break;
		case "previous":
			--users[userID].currentQuestion;
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