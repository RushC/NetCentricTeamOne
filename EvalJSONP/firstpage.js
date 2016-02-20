addEventListener("load", function() {
	// Set the side frame to our navigation page.
	var sideFrameWin = parent.document.getElementById("sframe").contentWindow;
          sideFrameWin.location = "/EvalJSONP/side.html";

    // Create the userID.
    createID();
});

/**
 * Sends a request to the server for a generated
 * user ID and saves the response to the browser's
 * session storage.
 */
function createID() {
	// Check if the userID is already defined.
	if (sessionStorage.getItem("createID"))
		return;

	// Create a JSONP request asking for an ID.
	var script = document.createElement("SCRIPT");
	script.src = "/EvalJSONP/getID" + "?callback=createID.receiveID";
	document.body.appendChild(script);

	// Define the callback function.
	createID.receiveID = function(userID) {
		// Save the ID in the browser's session storage.
		sessionStorage.setItem("userID", userID);
	};
}