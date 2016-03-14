addEventListener("load", function() {
    // Fade in the div.
    $("#controlDiv").hide().fadeIn();
    
    // Listen for rows input.
    document.getElementById("rowsInput").onchange = function() {
        document.getElementById("rowsLabel").innerHTML = "Rows: " + this.value;  
    };
    
    // Listen for flags per row input.
    document.getElementById("flagsPerRowInput").onchange = function() {
        document.getElementById("flagsPerRowLabel").innerHTML = "Flags per row: " + this.value;
    }
    
    // Listen for maximum spin rate input.
    document.getElementById("maxSpinRateInput").onchange = function() {
        document.getElementById("maxSpinRateLabel").innerHTML = "Max Spin Rate: " + this.value;
    }
    
    // Define apply action.
    document.getElementById("applyButton").onclick = function() {
        // Gather all of the inputs.
        var rows = document.getElementById("rowsInput").value;
        var flagsPerRow = document.getElementById("flagsPerRowInput").value;
        var maxSpinRate = document.getElementById("maxSpinRateInput").value;
        
        // Recreate the flags with the specified settings.
        parent.document.getElementById("cframe").contentWindow.makeFlags(rows, flagsPerRow, 0.5, maxSpinRate, 1);  
    };
});