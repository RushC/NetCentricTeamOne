function start() {
	parent.document.getElementById("cframe").contentWindow.location = "/EvalJSONP/evaltool.html";
	//document.getElementById("startButton").style.visibility = "hidden";
	//$("#startButton").fadeOut();
	$("#startButton").animate({left: '-250px'});
	
	document.getElementById("firstButton").disabled=false
	document.getElementById("previousButton").disabled=false
	document.getElementById("nextButton").disabled=false
	document.getElementById("lastButton").disabled=false
	document.getElementById("submitButton").disabled=false
	document.getElementById("emailButton").disabled=false
}

function first() {
	var answer = parent.document.getElementById("cframe").contentDocument.querySelector("input:checked");

	var script = document.createElement("SCRIPT");
	script.src = "/EvalJSONP/first"
		+ "?callback=loadQuestion&userID="
		+ sessionStorage.getItem("userID");

	// Check if the user selected an answer.
	if (answer)
		script.src += "&answer=" + answer.value;

	document.body.appendChild(script);
}

function previous() {
	var answer = parent.document.getElementById("cframe").contentDocument.querySelector("input:checked");

	var script = document.createElement("SCRIPT");
	script.src = "/EvalJSONP/previous"
		+ "?callback=loadQuestion&userID="
		+ sessionStorage.getItem("userID");

	// Check if the user selected an answer.
	if (answer)
		script.src += "&answer=" + answer.value;

	document.body.appendChild(script);
}

function next(){
	var answer = parent.document.getElementById("cframe").contentDocument.querySelector("input:checked");

	var script = document.createElement("SCRIPT");
	script.src = "/EvalJSONP/next"
		+ "?callback=loadQuestion&userID="
		+ sessionStorage.getItem("userID");

	// Check if the user selected an answer.
	if (answer)
		script.src += "&answer=" + answer.value;

	document.body.appendChild(script);
}

function last(){
	var answer = parent.document.getElementById("cframe").contentDocument.querySelector("input:checked");

	var script = document.createElement("SCRIPT");
	script.src = "/EvalJSONP/last"
		+ "?callback=loadQuestion&userID="
		+ sessionStorage.getItem("userID");

	// Check if the user selected an answer.
	if (answer)
		script.src += "&answer=" + answer.value;

	document.body.appendChild(script);
}

function done(){
	
}

function email(){
	
}

/**
 * Loads the question currently stored in the cookie
 * into the form.
 */
function loadQuestion(res) {
	// Remove any old choices.
	var oldChoice;
	while (oldChoice = parent.document.getElementById("cframe").contentDocument.querySelector(".choice"))
		$(oldChoice).remove();

	var res = JSON.parse(res);
	var quizDocument = parent.document.getElementById("cframe").contentDocument;

	// Set the title of the form.
	var current = res.questionNumber;
	var total = res.questionTotal;
	quizDocument.querySelector("#quizLegend").innerHTML = "Question " + current + " of " + total;

	// Check if the previous button should be hidden.
	quizDocument.querySelector("#prev").hidden = current == 1;
	// Check whether the next button or the submit button should be displayed.
	quizDocument.querySelector("#next").hidden = current == total;
	quizDocument.querySelector("#submit").hidden = current != total;

	
	//Check whether the side buttons should be hidden
	if(current == 1){
		$("#previousButton").stop().animate({"opacity":0.3,"disabled":true},"fast");
	}else{
		$("#previousButton").stop().animate({"opacity":1,"disabled":false},"fast");
	}
	
	if(current == total){
		console.log("wat");
		$("#nextButton").stop().animate({"opacity":0.3,"disabled":true},"fast");
	}else{
		$("#nextButton").stop().animate({"opacity":1,"disabled":false},"fast");
	}
	
	// Load the question object from the cookie.
	var question = res.question;

	// Display the question text.
	quizDocument.querySelector("#questionContent").innerHTML = question.text;
	// Display the image if there is one.
	if (question.img)
		quizDocument.querySelector("#questionImage").src = question.img;
	else
		quizDocument.querySelector("#questionImage").style.display = "none";

	// Iterate through each of the answers.
	for (var i = 0; i < question.choices.length; i++) {
		// Create a div to hold the choice.
		var div = quizDocument.createElement('DIV');
		div.className = "choice";

		// Create a radio button input for the answer.
		var radio = quizDocument.createElement('INPUT');
		radio.type = "radio";
		radio.name = "answer";
		radio.value = i;
		radio.hidden = true;

		// Check the user's selected answer to see if the radio
		// button should be checked.
		if (res.currentAnswer == i) {
			radio.checked = true;
			div.classList.toggle("selected");
		}

		// Create a label for the radius button.
		var label = quizDocument.createElement('LABEL');
		label.innerHTML = question.choices[i];

		// Add to the quizDocument.
		quizDocument.querySelector("#choices").appendChild(div);
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
