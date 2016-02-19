/**
 * Used for retrieving the webpage.
 */
 function gettool(req, res) {
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

 function posttool(req, res) {
 	console.log(req.body);
 	res.status(200);
 	res.send("World: 'Sup");
 };

 exports.gettool = gettool;
 exports.posttool = posttool;