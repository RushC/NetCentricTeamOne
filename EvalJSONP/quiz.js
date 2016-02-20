addEventListener("load", function() {
	// Load the current question.
	loadQuestion();

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
	if (question.img)
		document.querySelector("#questionImage").src = question.img;
	else
		document.querySelector("#questionImage").style.display = "none";

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
		radio.hidden = true;

		// Check the user's selected answer to see if the radio
		// button should be checked.
		if (getValue(getValue("current")) == i) {
			radio.checked = true;
			div.classList.toggle("selected");
		}

		// Create a label for the radius button.
		var label = document.createElement('LABEL');
		label.innerHTML = question.choices[i];

		// Add to the document.
		document.querySelector("#choices").appendChild(div);
		div.appendChild(radio);
		div.appendChild(label);

		// Add listeners to change the style when the div is hovered over.
		div.addEventListener("mouseenter", function() {
			$(this).switchClass("", "hover", 100);
		});
		div.addEventListener("mouseleave", function() {
			$(this).switchClass("hover", "", 100);
		});

		// Add a click listener to the div.
		div.addEventListener("click", function() {
			// Set the radio button's checked
			this.firstChild.checked = true;
			// Add the selected class to the div.
			$(this).switchClass("", "selected", "fast");
			// Remove the other divs' selected class.
			for (var di = 0; di < this.parentElement.children.length; di++) {
				// Ensure the div is not the current div.
				var d = this.parentElement.children[di];
				if (d != this)
					$(d).switchClass("selected", "");
			}
		});
	}
}
