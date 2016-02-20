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
	    var timeString = (h < 10 ? "0" : "") + now.toLocaleTimeString();

	    // Set the time label's value to the time string.
	    document.getElementById("current-time").innerHTML = timeString;
	     
	    // Retrieve the graphics context for the clock element.
	    var canvas = document.getElementById("clock");
	    var context = canvas.getContext("2d");
	    var maxArmRadius = 75;
	     
	    // Center position for the clock.
	    var centerX = canvas.width / 2;
	    var centerY = canvas.height / 2;
	    
	    /**
		 * Draws a clock arm.
		 * 
		 * Parameters:
		 * 		rotation - the number of degrees the arm should be rotated from 12:00
		 *		thickness - the thickness of the arm
		 *		length - the length of the arm as a percentage of the maximum hand radius.
		 *		color - the color of the arm
	     */
	    function drawArm(rotation, thickness, length, color) {
	    	// Convert the rotation from degrees to radians.
	        var armRadians = (2 * Math.PI * rotation) - (Math.PI / 2);

	        // Calculate the endpoint for the arm to be drawn to.
	        var endX = centerX + Math.cos(armRadians) * (length * maxArmRadius);
	        var endY = centerY + Math.sin(armRadians) * (length * maxArmRadius);
	     
	     	// Set the context's line width and stroke style.
	        context.lineWidth = thickness;
	        context.strokeStyle = color;
	     	
	     	// Draw a line from the clock's center to the calculated endpoint.
	        context.beginPath();
	        context.moveTo(centerX, centerY);
	        context.lineTo(endX, endY);
	        context.stroke();
	    }

	    // Draw the clock background image on the canvas.
	    // (This also prevents the need to clear the canvas each second.)
	    context.drawImage(clockBG, 0, 0);

	    // Draw each arm over the clock. 
	    drawArm(((h + (m/60) + (s/3600))/12), 6, 0.50, '#000000');  				// Hour
	    drawArm(((m + (s/60))/60),  4, 0.75, "#000000"); 							// Minute
	    drawArm(s / 60, 2, 1.00, '#FF0000'); 				  						// Second
	}
});