$(document).ready(function() {
	// Animate the side div in.
	$("#sideDiv").hide().fadeIn();
	
	// Add hover functionality to each button.
	var buttons = $("button");
	for (var i = 0; i < buttons.length; i++) {
		// Add the hover class when the mouse enters the button.
		$(buttons[i]).mouseenter(function() {
			$(this).stop(true, true).switchClass("", "hover", 200);
		});
		// Remove the hover class when the mouse leaves the button.
		$(buttons[i]).mouseleave(function() {
			$(this).stop(true, true).switchClass("hover", "", 200);
		});
	}
});

function rosterJSP() {
	parent.document.getElementById("cframe").contentWindow.location = "http://localhost:8080/WebRoster/Roster.jsp"
}

function rosterMVC() {
    parent.document.getElementById("cframe").contentWindow.location = "http://localhost:8080/WebRosterMVC/";
}

function rosterJTable() {
    parent.document.getElementById('cframe').contentWindow.location = "http://localhost:8080/WebRosterJTable/";
}

function amazon() {
    parent.document.getElementById('cframe').contentWindow.location = "http://localhost:8888/AmazonBook/amazon.html";
}
