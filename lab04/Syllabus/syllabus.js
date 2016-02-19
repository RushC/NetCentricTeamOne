function gettool(req, res) {
	// Retrieve the path of syllabus.html
	var filename = gettool.root + req.path;

	// Sends syllabus.html to the client.
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

// Add the function to the module.
exports.gettool = gettool;
