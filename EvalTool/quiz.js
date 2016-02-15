addEventListener("load", function() {
	// Load the current question.
	loadQuestion();

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
 * Loads the question currently stored in the cookie
 * into the form.
 */
function loadQuestion() {
	// Set the title of the form.
	var current = getValue("current");
	var total = getValue("total");
	document.querySelector("#quizLegend").innerHTML = "Question " + current + " of " + total;

	// Check if the previous button should be hidden.
	document.querySelector("#prev").hidden = current == 1;
	// Check whether the next button or the submit button should be displayed.
	document.querySelector("#next").hidden = current == total;
	document.querySelector("#submit").hidden = current != total;

	// Load the question object from the cookie.
	var question = JSON.parse(getValue("question"));
	
	// Display the question text.
	document.querySelector("#questionContent").innerHTML = question.text;
	// Display the image if there is one.
	document.querySelector("#questionImage").src = question.img || "";

	// Iterate through each of the answers.
	for (var i = 0; i < question.choices.length; i++) {
		// Create a div to hold the choice.
		var div = document.createElement('DIV');
		div.className = "choice";

		// Create a radio button input for the answer.
		var radio = document.createElement('INPUT');
		radio.type = "radio";
		radio.name = "answer";
		radio.value = i;

		// Check the user's selected answer to see if the radio
		// button should be checked.
		radio.checked = getValue(getValue("current")) == i;

		// Create a label for the radius button.
		var label = document.createElement('LABEL');
		label.innerHTML = question.choices[i];

		// Add to the document.
		document.querySelector("#choices").appendChild(div);
		div.appendChild(radio);
		div.appendChild(label);
	}
}