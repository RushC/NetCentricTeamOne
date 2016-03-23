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
                addNoteButton(
                    "Note " + cursor.value.noteID 
                                + ": Lecture " + cursor.value.lectureID
                                + " - Slide "+ cursor.value.slideID,
                    cursor.value.noteID, cursor.value.note
                );
                
                // Set the text for the text field.
                $("#noteTextField").html(cursor.value.note);
                
                //repeat for the next note in the database:
                cursor.continue();
            }
        }
    }

    req.onupgradeneeded = function(e) {
        //get the database object:
        var database = e.target.result;
        //create the objectStore for notes:
        var objectStore = database.createObjectStore("notes", {keyPath: "noteID", autoIncrement: true});
        //create indexes for lectureID, slideID, and note:
        objectStore.createIndex("lectureID", "lectureID", {unique : false});
        objectStore.createIndex("slideID", "slideID", {unique : false});
        objectStore.createIndex("note", "note", {unique : false});
    }
});

/**
 * Adds a note with the specified fields to the database.
 *
 * @param lectureID
 *      the ID of the lecture that the inserted note belongs to
 * @param slideID
 *      the ID of the slide that the inserted note belongs to
 * @param noteID
 *      the ID of the note
 * @param note
 *      the content of the note
 */
function addNote(lectureID, slideID, note) {
    var objectStore = database.transaction(["notes"], "readwrite").objectStore("notes");
    objectStore.add({
        slideID: slideID,
        lectureID: lectureID,
        note: note
    }).onsuccess = function(e) {
        // Add a radio button for the note.
        addNoteButton(
            "NEW"   + ": Lecture " + lectureID
                    + " - Slide "+ slideID,
            e.target.result.noteID, note
        );
    };
}

/**
 * Saves the specified note for the specified noteID stored in
 * the databse.
 * 
 * @param noteID - the database key for the note object to modify.
 * @param note - thr note to save to the note object.
 */
function saveNote(noteID, note) {
    // Open the object store where all f the notes are stored,
    var objectStore = database.transaction(["notes"], "readwrite").objectStore("notes");
    
    console.log(note);
    
    var transaction = objectStore.get(noteID);
    // Wait for a success message.
    transaction.onsuccess = function(e) {        
        var oldNote = e.target.result;
        oldNote.note = note;
        
        // Update the note.
        objectStore.put(oldNote);
    };
}

/**
 * Removes the specified note from the list.
 *
 * @param noteID
 *      the ID of the note to remove from the list.
 */
function deleteNote(noteID) {
    // Retrieve the object store for the notes.
    var objectStore =  database.transaction(["notes"], "readwrite").objectStore("notes");
    console.log(noteID);
    
    // Remove the note from the database.
    objectStore.delete(noteID);

    // Remove the radio button for the note.
    var button = $('input[value="' + noteID + '"]');
    $(button[0].parentElement).slideUp("fast");
}

function addNoteButton(text, noteID, note) {
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
    // Set the radio button's value to the note's identification.
    button.value = noteID;

    // Add listeners to change the style when the div is hovered over.
    buttonDiv.addEventListener("mouseenter", function() {
        $(this).switchClass("", "hover", 100);
    });
    buttonDiv.addEventListener("mouseleave", function() {
        $(this).switchClass("hover", "", 100);
    });
    
    //create the label describing the note:
    var label = document.createElement("LABEL");
    label.innerHTML = text;

    //add the label and button to the buttonDiv:
    buttonDiv.appendChild(button);
    buttonDiv.appendChild(label);
    
    // Add a div containing the note's contents.
    var contentDiv = document.createElement('DIV');
    var content = document.createElement('TEXTAREA');
    var saveButton = document.createElement('BUTTON');
    var deleteButton = document.createElement('BUTTON');
    
    // Add the div to the button div.
    contentDiv.appendChild(content);
    contentDiv.appendChild(saveButton);
    contentDiv.appendChild(deleteButton);
    buttonDiv.appendChild(contentDiv);
    
    // Set the settings for the textarea.
    content.innerHTML = note;
    content.style.display = "block";
    content.rows = 10;
    
    // Set the settings for the save button.
    saveButton.innerHTML = "Save";
    saveButton.onclick = function() {
        saveNote(noteID, content.value);
    }
    
    // Set the settings for the delete button.
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = function() {
        deleteNote(noteID);
    }
    
    // Hide the content initially.
    $(contentDiv).hide();
    
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
            if (d != this) {
                $(d).switchClass("selected", "");
                $(d.lastChild).slideUp("fast");
            }
        }
        // Expose the content.
        $(contentDiv).slideDown("fast");
    });

    //add the buttonDiv to the div:
    div.appendChild(buttonDiv);
    
    $(buttonDiv).hide().slideDown("fast");
}