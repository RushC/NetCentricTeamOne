$(document).ready(function() {
	// Add hover functionality to each button.
	var buttons = $("button");
	for (var i = 0; i < buttons.length; i++) {
		// Add the hover class when the mouse enters the button.
		$(buttons[i]).mouseenter(function() {
			$(this).switchClass("", "hover", 150);
		});
		// Remove the hover class when the mouse leaves the button.
		$(buttons[i]).mouseleave(function() {
			$(this).switchClass("hover", "", 150);
		});
	}

	// Animate the navigation bar in.
	$("#navDiv").hide().fadeIn();
});

function start() {
	parent.document.getElementById("cframe").contentWindow.location = "/EvalJSONP/evaltool.html";

	// Give the document some time to load the new page and load the first question.
	setTimeout(first, 100);

	// Animate the start button out.
	$("#startButton").slideUp("fast");

	// Animate the navigation buttons in.
	$("#nextButton").animate({"opacity":1,"disabled":false},"fast");
	$("#lastButton").animate({"opacity":1,"disabled":false},"fast");
	$("#previousButton").animate({"opacity":1,"disabled":false},"fast");
	$("#firstButton").animate({"opacity":1,"disabled":false},"fast");
	$("#submitButton").animate({"opacity":1,"disabled":false},"fast");
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
	// Ensure the user would like to submit the quiz.
    if (!confirm("Are you sure you would like to submit your quiz?", "Yes", "No"))
        return;
    
    // Create a new XMLHttpRequest.
    var req = new XMLHttpRequest();
    
    // Open the request.
    req.open('POST', '/EvalJSONP/submitQuiz');
    
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    
    // Add the userID to the request params.
    var params = "userID=" + sessionStorage.getItem("userID");
    
    // Add the current answer to the request header.
    var answer = parent.document.getElementById("cframe").contentDocument.querySelector("input:checked");
    if (answer)
        params += "&answer=" + answer.value;
    
    // Define response handler.
    req.onreadystatechange = function() {        
        // Check if the response is ready.
        if (req.readyState != 4)
            return;
        
        // Check if the request was successful.
        if (req.status != 200) {
            alert("Something went wrong!");
            return;
        }
        
        // Save the grade received from the server's response in the session storage.
        sessionStorage.setItem("grade", req.responseText);
        
        // Redirect the content frame to the evaluation page.
        parent.document.getElementById("cframe").contentWindow.location = "/EvalJSONP/evaluation.html";
        
        // Remove the navigation buttons.
        $("#quizNav").slideUp();
        
        // Make the email button visible.
        $("#emailButton").animate({"opacity":1,"disabled":false},"fast");
    };
    
    // Send the request.
    req.send(params);
}

function email(){
	// Submit the evaluation's email form.
    parent.document.getElementById("cframe").contentDocument.getElementById("emailForm").submit();
}

/**
 * Loads the question currently stored in the cookie
 * into the form.
 */
function loadQuestion(res) {
	var quizDocument = parent.document.getElementById("cframe").contentDocument;

	// Remove any old choices.
	var oldChoice;
	while (oldChoice = quizDocument.querySelector(".choice"))
		$(oldChoice).remove();

	// Parse the response object.
	var res = JSON.parse(res);
	var quizDocument = parent.document.getElementById("cframe").contentDocument;

	// Set the title of the form.
	var current = res.questionNumber;
	var total = res.questionTotal;
	quizDocument.querySelector("#quizLegend").innerHTML = "Question " + current + " of " + total;
    
    // Save the question total to the session storage for the evaluation page.
    sessionStorage.setItem("total", total);
	
	// Check whether the side buttons should be disabled.
	if(current == 1) {
        $("#previousButton").animate({"opacity":0.3},"fast").mouseleave()[0].disabled = true;
		$("#firstButton").animate({"opacity":0.3},"fast").mouseleave()[0].disabled = true;
	}
	else {
		$("#previousButton").animate({"opacity":1},"fast")[0].disabled = false;
		$("#firstButton").animate({"opacity":1},"fast")[0].disabled = false;
	}
	
	if(current == total) {
        $("#nextButton").animate({"opacity":0.3},"fast").mouseleave()[0].disabled = true;
		$("#lastButton").animate({"opacity":0.3},"fast").mouseleave()[0].disabled = true;
	}
	else {
		$("#nextButton").animate({"opacity":1},"fast")[0].disabled = false;
		$("#lastButton").animate({"opacity":1},"fast")[0].disabled = false;
	}
	
	// Load the question object from the cookie.
	var question = res.question;

	// Display the question text.
	quizDocument.querySelector("#questionContent").innerHTML = question.text;
	// Display the image if there is one.
	if (question.img) {
		quizDocument.querySelector("#questionImage").src = question.img;
		quizDocument.querySelector("#questionImage").style.display = "block";
	}
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
