/**
 * Used for retrieving the webpage.
 */

function gettool(req, res) {
	switch (req.path) {
		case "/EvalJSONP/getID":
			res.jsonp(JSON.stringify(addUser())); //add the user and send them their ID
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
	}
}

function posttool(req, res) {
	switch (req.path) {
		case "/EvalJSONP/getID":
			res.jsonp(JSON.stringify(addUser())); //add the user and send them their ID
	}
};

function sendQuestion(res, id, old) {}



//constructor for user object:
function User() {
	this.currentQuestion = 1; //question of the quiz the user is viewing
	this.amswers = []; //answers to the questions submitted by the user
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