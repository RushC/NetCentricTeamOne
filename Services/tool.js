function gettool(req, res) {
	var filename = gettool.root + req.path;

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

exports.gettool = gettool;
