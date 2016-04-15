function gettool(req, res) {
	var filename = gettool.root + req.path;

	res.sendFile(filename, function (err) {
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
	if(DEBUG) {
		console.log("ID: " + req.body.amazonID);
		console.log("KEY: " + req.body.amazonKey);
		console.log("SEARCH: " + req.body.amazonSearch);
	}

	if(DEBUG == false && (req.body.amazonID == "" || req.body.amazonKey == "" || req.body.amazonSearch == "")) {
		res.send("Please fill in all text fields!");
	} else {
		//Amazon
		amazonSearch(req.body.amazonID, req.body.amazonKey, req.body.amazonSearch);
		response = res;
		setTimeout(function () {
			if (control == "NOT DONE")
				searchResult = "Connection to AWS timed out";
			response.send(searchResult);
			control = "NOT DONE";
		}, 1000);
	}
}

var DEBUG = false; //Set to true to ignore text fields and use default keys/search, enables debug logs

var searchResult = "NONE";
var control = "NOT DONE";
var response;

var picture = "PICTURE NOT LOADED";


exports.gettool = gettool;
exports.posttool = posttool;


//Amazon API
//These are great clean programming concepts and ideas A++ trust me
function amazonSearch(id, key, search) {
	var aws = require("aws-lib");

	if(DEBUG){
		//My own key that took forever omg they had a robot call my phone
		id = "AKIAJTXO7LB2XAHXZH5Q";
		key = "OgyQy7EUolqy3TpOjIC5P/xdxRVUCcfY4GFZTR0r";

		//Search parameters
		search = "test";
	}
	
	searchResult = "NONE";
	prodAdv = aws.createProdAdvClient(id, key, "NetCentric");
	
	prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: search, ResponseGroup: "ItemAttributes", TotalPages: "2"}, function (err, result) {
		//console.log(JSON.stringify(result, null, 2));

		//Collect search results
		var book = result.Items.Item;
		var books = [];
		for (var i = 0; i < book.length; i++) {
			var asin = book[i].ASIN;
			var pageURL = book[i].DetailPageURL;
			var author = book[i].ItemAttributes.Author;
			var edition = book[i].ItemAttributes.Edition;
			var isbn = book[i].ItemAttributes.ISBN;
			var title = book[i].ItemAttributes.Title;

			books.push({asin, pageURL, author, edition, isbn, title});
		}
		
		//Initial HTML
		searchResult = "<h1 style=\"color: #FF5722;\">Search Results:</h1>";
		searchResult += "<link href='https://fonts.googleapis.com/css?family=Roboto:400,900,700' rel='stylesheet' type='text/css'>";
		searchResult += "<style>body{font-family: Roboto}</style>";
		
		//For each book
		for (var i = 0; i < books.length; i++) {
			var asin = book[i].ASIN;
			
			prodAdv.call("ItemLookup", {ItemId: asin, ResponseGroup: "Images", TotalPages: "2"}, (function() {
				var index = i;
				return function (err, result2) {
					//Retrieve image
					
					if(DEBUG) {
						console.log("CURRENT LOOP: " + index);
						console.log("About to search: " + asin);
						console.log(JSON.stringify(result2, null, 2));
					}
					
					picture = result2.Items.Item.LargeImage.URL;
					if(DEBUG)
						console.log("Searching thread result: " + picture);
				
					//Numbering (Out of order, broken)
					//searchResult += ("<h3><b>" + (index + 1) + ".</b> ");

					//URL and Title
					//Truncate title first
					var title = books[index].title;
					if (title.length > 100) {
						title = title.substring(0, 100);
						title += "...";
					}
					searchResult += ("<h3><a href=\"" + books[index].pageURL + "\">" + title + "</a></h3>");

					//Image
					searchResult += ("<img src=\"" + picture + "\" style=\"width:200px;height:250px;\" border=\"4\" style=\"border-color:#FF5722;\" \"<br><br>");
					if(DEBUG)
						console.log("PICTURE PLACEMENT COMPLETE");
					
					picture = "PICTURE NOT LOADED"; //Reset

					//Author
					if(books[index].author != undefined)
						searchResult += ("<br><b>Author:</b> " + books[index].author + "<br>");

					//Edition
					if(books[index].edition != undefined)
						searchResult += ("<b>Edition:</b> " + books[index].edition + "<br>");

					//ISBN
					if(books[index].isbn != undefined)
						searchResult += ("<b>ISBN:</b> " + books[index].isbn + "<br>");

					//Spacer
					searchResult += ("<br><br>");
				}
			})());
		}
			
		//Done
		control = "DONE"; //Reset
	});
}
