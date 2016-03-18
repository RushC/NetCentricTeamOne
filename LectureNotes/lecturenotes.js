addEventListener("load", function() {
    parent.document.getElementById("sframe").contentDocument.location = "/LectureNotes/side.html";
    
    //try to open the database:
    var req = window.indexedDB.open("noteDB", 1);
    
    //if an error happened:
    req.onerror = function(e) {
        alert("Could not open notes database.");
    }
    
    //otherwise set the database and generate the radio buttons:
    req.onsuccess = function(e) {
        window.database = event.target.result;
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
        var objectStore = database.transaction("notes").objectStore("notes");
        //use a cursor to iterate through each note:
        objectStore.openCursor().onsuccess = function(e) {
            var cursor = e.target.result;
            if (cursor) {
                // Add a radio button for the note.
                addNoteButton(cursor.value.lectureID + ", " 
                              + cursor.value.slideID + ", " 
                              + cursor.value.noteID);
                
                // Set the text for the text field.
                $("#noteTextField").value = cursor.value.note;
                
                //repeat for the next note in the database:
                cursor.continue();
            }
        }
    }

    req.onupgradeneeded = function(e) {
        //get the database object:
        var database = e.target.result;
        //create the objectStore for notes:
        var objectStore = database.createObjectStore("notes", {keyPath: "noteID"});
        //create indexes for lectureID, slideID, and note:
        objectStore.createIndex("lectureID", "lectureID", {unique : false});
        objectStore.createIndex("slideID", "slideID", {unique : false});
        objectStore.createIndex("note", "note", {unique : false});
    }
});

function addNote(lectureID, slideID, noteID, note) {
    var objectStore = database.transaction(["notes"], "readwrite").objectStore("notes");
    objectStore.add({
        noteID: noteID,
        slideID: slideID,
        lectureID: lectureID,
        note: note
    });
    addNoteButton(lectureID + ", " + slideID + ", " + noteID);
}

function addNoteButton(text) {
    //get the div that holds the radio buttons:
    var div = document.getElementById("notesDiv");
    
    //create a div for this radio button:
    var buttonDiv = document.createElement("DIV");
    buttonDiv.classList.add("note");
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
    var label = document.createElement("LABEL");
    label.innerHTML = text;

    //add the label and button to the buttonDiv:
    buttonDiv.appendChild(button);
    buttonDiv.appendChild(label);

    //add the buttonDiv to the div:
    div.appendChild(buttonDiv);
    
    $(buttonDiv).hide().fadeIn();
}