window.addEventListener("load", function() {
	insertScore();
	document.querySelector("#sender_name").onchange = updateMessage
    document.querySelector("#userID").value = sessionStorage.getItem("userID");

	// Display an appropriate label for the message status:
	var messageStatusLabel = document.querySelector("label[for='messageStatus']");
	if (getValue("messageStatus") == "fail") {
		messageStatusLabel.innerHTML = "There was an error sending your message.";
		messageStatusLabel.style.color = "red";
		messageStatusLabel.style.display = "block";
		// Reset the value.
		//setValue("messageStatus", "");
	}
	else if (getValue("messageStatus") == "success") {
		messageStatusLabel.innerHTML = "Your message was sent successfuly";
		messageStatusLabel.style.color="blue";
		messageStatusLabel.style.display="block";
		// Reset the value.
		//setValue("messageStatus", "");
	}

	// Add hover behavior for all buttons.
	var buttons = document.getElementsByTagName("button");
	for (var i = 0; i < buttons.length; i++) {
		// Add class hover whenever a button is hovered over.
		buttons[i].onmouseenter = function() {
			this.className = "hover";
		};
		// Remove the hover class whenever the button is left.
		buttons[i].onmouseleave = function() {
			this.className = "";
		};
	}
});

/**
 * Inserts the score data into the table.
 */
function insertScore() {
    // Load the total and grade from the session storage.
	var total = sessionStorage.getItem("total");
	var correct = sessionStorage.getItem("grade");

	document.querySelector("#totalCell").innerHTML = total;
	document.querySelector("#correctCell").innerHTML = correct;
	document.querySelector("#incorrectCell").innerHTML = total - correct;
	document.querySelector("#scoreCell").innerHTML = (correct / total * 100) + "%";
}

/**
 * Update the message content to match the name.
 */
function updateMessage() {
	// Load the total and grade from the session storage.
	var total = sessionStorage.getItem("total");
	var correct = sessionStorage.getItem("grade");
	var name = document.querySelector("#sender_name").value;

	document.querySelector("#message").innerHTML = name + " scored " + correct + "/" + total + " on the Netcentric Javascript Quiz.";
}