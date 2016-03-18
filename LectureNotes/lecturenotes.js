addEventListener("load", function() {
    parent.document.getElementById("sframe").contentDocument.location = "/LectureNotes/side.html";
    
    //try to open the database:
    var req = window.indexedDB.open("noteDB", 1);
    
    //if an error happened:
    req.onerror = function(e) {
        alert("Could not open notes database.");
    }
    
    //otherwise set the database variable:
    req.onsuccess = function(e) {
        var database = event.target.result;
        //handle any database errors:
        database.onerror = function(e) {
            alert("There was an error in the notes database");
        }
        
        //get the div that holds the radio buttons:
        var div = document.getElementById("notesDiv");
        //make sure the div is empty:
        while(div.firstChild) {
            div.removeChild(div.firstChild);
        }
        //populate the div with radio buttons for the notes:
        var objectStore database.transaction("notes").objectStore("notes");
        //use a cursor to iterate through each note:
        objectStore.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                //create a div for this radio button:
                var buttonDiv = document.createElement("DIV");
                //create the radio button:
                var button = document.createElement("INPUT");
                button.type = "radio";
                button.name = "note";
                button.hidden = true;
                
                // Add listeners to change the style when the div is hovered over.
                buttonDiv.addEventListener("mouseenter", function() {
                    $(this).switchClass("", "hover", 100);
                });
                buttonDiv.addEventListener("mouseleave", function() {
                    $(this).switchClass("hover", "", 100);
                });

                // Add a click listener to the div.
                buttonDiv.addEventListener("click", function() {
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
                
                //create the label describing the note:
                var label = docuement.createElement("LABEL");
                label.innerHTML = cursor.value.lecture + ", " + cursor.value.slide + ", " + cursor.value.noteID + ", " + cursor.value.note;
                
                //add the label and button to the buttonDiv:
                buttonDiv.appendChild(button);
                buttonDiv.appendChild(label);
                
                //add the buttonDiv to the div:
                div.appendChild(buttonDiv);
                
                //repeat for the next note in the database:
                cursor.continue;
            }
        }
    }
    
    //
});