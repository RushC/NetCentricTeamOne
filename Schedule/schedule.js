function gettool(req, res) {
    //determine what the client is requesting:
    var filename = gettool.root + req.path;
    switch(req.path) {
        case "/Schedule/content" : //request for the content of the schedule:
            res.jsonp(JSON.stringify(schedule));
        default : //generic request handling:
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
    // Send the file as a response.
    res.send
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

exports.gettool = gettool;