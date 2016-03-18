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
	$("#sideDiv").hide().fadeIn();
	
});

function addNotes() {
	var lectureID = prompt("Please input the lecture ID:");
    var slideID = prompt("Please input the slide ID:");
    var noteID = prompt("Please input the note ID:");
    var note = prompt("Please input the note:");
    
    parent.document.getElementById("cframe").contentWindow.addNote(lectureID, slideID, noteID, note);
}

function deleteNotes() {
	
}

function viewNotes() {
	
}
