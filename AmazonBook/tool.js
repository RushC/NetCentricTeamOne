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
	console.log("ID: " + req.body.amazonID);
	console.log("KEY: " + req.body.amazonKey);
	console.log("SEARCH: " + req.body.amazonSearch);

	//Amazon
	amazonSearch();
	response = res;
	setTimeout(function () {
		if (control == "NOT DONE")
			searchResult = "Connection to AWS timed out";
		response.send(searchResult);
		control = "NOT DONE";
	}, 700);
}

var searchResult = "NONE";
var control = "NOT DONE";
var response;


var picture = "PICTURE NOT LOADED";
var pictureControl = "NOT DONE";


exports.gettool = gettool;
exports.posttool = posttool;


//Amazon API
//These are great clean programming concepts and ideas A++ trust me

function amazonSearch() {
	//var aws = require("./node_modules/aws-lib/lib/aws");
	var aws = require("aws-lib");

	//Temporary - my own key that took forever omg they had a robot call my phone
	var id = "AKIAJTXO7LB2XAHXZH5Q";
	var key = "OgyQy7EUolqy3TpOjIC5P/xdxRVUCcfY4GFZTR0r";

	//Search parameters
	var search = "test";

	prodAdv = aws.createProdAdvClient(id, key, "NetCentric");

	searchResult = "NONE";
	
	
	prodAdv.call("ItemSearch", {SearchIndex: "Books", Keywords: search, ResponseGroup: "ItemAttributes", TotalPages: "2"}, function (err, result) {
		//console.log(JSON.stringify(result, null, 2));

		//Collect search results
		var books = [];
		var book = result.Items.Item;
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
		searchResult += "<link href='https://fonts.googleapis.com/css?family=Roboto:400,900,700' rel='stylesheet' type='text/css'>"
		searchResult += "<style>body{font-family: Roboto}</style>"
		
		//For each book
		for (var i = 0; i < books.length; i++) {
			//Retrieve image
			var asin = book[i].ASIN;
			console.log("Searching: " + asin);
			prodAdv.call("ItemLookup", {ItemId: asin, ResponseGroup: "Images", TotalPages: "2"}, function (err, result2) {
				//console.log(JSON.stringify(result, null, 2));
				picture = result2.Items.Item.LargeImage.URL;
				console.log("Searching thread result: " + picture);
				pictureControl = "DONE";
				//*********PLEASE MAKE THIS HAPPEN FIRST OMG******************
			});


			//Numbering
			searchResult += ("<h3><b>" + (i + 1) + ".</b> ");

			//URL and Title
			//Truncate URL first
			var title = books[i].title;
			if (title.length > 100) {
				title = title.substring(0, 100);
				title += "...";
			}
			searchResult += ("<a href=\"" + books[i].pageURL + "\">" + title + "</a></h3>");

			//Image
			searchResult += ("<img src=\"" + picture + "\" style=\"width:200px;height:200px;\"<br><br>");
			console.log("PICTURE PLACEMENT COMPLETE");
			picture = "PICTURE NOT LOADED";

			//Author
			if(books[i].author != undefined)
				searchResult += ("<br><b>Author:</b> " + books[i].author + "<br>");

			//Edition
			if(books[i].edition != undefined)
				searchResult += ("<b>Edition:</b> " + books[i].edition + "<br>");

			//ISBN
			if(books[i].isbn != undefined)
				searchResult += ("<b>ISBN:</b> " + books[i].isbn + "<br>");

			//Spacer
			searchResult += ("<br><br>");
			pictureControl = "PICTURE NOT LOADED";
		}
			
		//Done
		control = "DONE";
	});
}
