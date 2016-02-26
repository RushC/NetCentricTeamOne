addEventListener("load", function() {
	// Set the side frame to our navigation page.
	var sideFrameWin = parent.document.getElementById("sframe").contentWindow;
          sideFrameWin.location = "/EvalJSONP/side.html";

    // Create the userID.
    createID();
	
	// Add hover behavior for all buttons.
	var buttons = document.getElementsByTagName("button");
	for (var i = 0; i < buttons.length; i++) {
		// Add class hover whenever a button is hovered over.
		buttons[i].onmouseenter = function() {
			//this.className = "hover";
			$(this).switchClass("", "hover");
		};
		// Remove the hover class whenever the button is left.
		buttons[i].onmouseleave = function() {
			//this.className = "";
			$(this).switchClass("hover", "");
		};
	}
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
