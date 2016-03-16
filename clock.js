window.addEventListener("load", function() {
	// Print out some browser information.
	console.log("Browser name: " + navigator.appName);
	console.log("Browser codename: " + navigator.appCodeName);
	console.log("Browser version: " + navigator.appVersion);

	// Have the analog clock appear when the digital clock is hovered over.
	document.querySelector("#currentTimeDiv").onmouseenter = function() {
		$("#clockDiv").stop().slideToggle("fast");
	};
	document.querySelector("#currentTimeDiv").onmouseleave = function() {
		$("#clockDiv").stop().slideToggle("fast");
	}

	// Hide the analog clock initially.
	document.querySelector("#clockDiv").hidden = true;

	// Get the background image for the clock face.
	if (document.querySelector)
		var clockBG = document.querySelector("#clockBG");
	else
		var clockBG = document.getElementById("clockBG");

	// Load the initial time.
	displayTime();

	// Update the clocks every second.
	setInterval(displayTime, 1000);

	/**
	 * Draws an anolog clock with the current time and
	 * sets the time for the time label.
	 */
	function displayTime() {
		// Get the current time.
	    var now = new Date();
	    var h = now.getHours() > 12 ? now.getHours() % 12 : now.getHours();
	    var m = now.getMinutes();
	    var s = now.getSeconds();

	    // Create a formatted string for the time.
	    var timeString = (h < 10 ? "" : "") + now.toLocaleTimeString();

	    // Set the time label's value to the time string.
	    document.getElementById("current-time").innerHTML = timeString;
		
		
		// Draw the clock using SVG
		function svgClock() {
			// Get current time.. again
			var now = new Date();
			var h, m, s;
			h = 30 * ((now.getHours() % 12) + now.getMinutes() / 60);
			m = 6 * now.getMinutes();
			s = 6 * now.getSeconds();

			// Find pointers of the clock, rotate
			document.getElementById('h_pointer').setAttribute('transform', 'rotate(' + h + ', 50, 50)');
			document.getElementById('m_pointer').setAttribute('transform', 'rotate(' + m + ', 50, 50)'); 
			document.getElementById('s_pointer').setAttribute('transform', 'rotate(' + s + ', 50, 50)');
			
			// Loop every second
			setTimeout(svgClock, 1000);
		}
	    svgClock();
	}
});
