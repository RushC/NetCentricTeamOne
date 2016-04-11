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

function posttool(req, res) {
	console.log("ID: " + req.body.amazonID);
	console.log("KEY: " + req.body.amazonKey);
	console.log("SEARCH: " + req.body.amazonSearch);
	
	//Amazon
	amazonSearch();
	
	//Reload page (Temporary, change later)
	res.redirect('back');
}

exports.gettool = gettool;
exports.posttool = posttool;


//Amazon API
function amazonSearch(){
	//var aws = require("./node_modules/aws-lib/lib/aws");
	var aws = require("aws-lib");
	
	//Temporary - my own key that took forever omg they had a robot call my phone
	var id = "AKIAJTXO7LB2XAHXZH5Q"
	var key = "OgyQy7EUolqy3TpOjIC5P/xdxRVUCcfY4GFZTR0r"
	
	prodAdv = aws.createProdAdvClient(id, key, "NetCentric");
	
	/*
	prodAdv.call("ItemSearch", {SearchIndex: "Books", Author: "Xiaocong Fan"}, function(err, result) {
		console.log(JSON.stringify(result));
	});
	*/
	prodAdv.call("ItemLookup", {ItemId: "0128015071"}, function(err, result) {
		console.log(JSON.stringify(result));
	});
}
