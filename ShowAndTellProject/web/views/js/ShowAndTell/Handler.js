/*
 * This script defines functions for handling events.
 */

/**
 * Called when the Add Lecture button is clicked.
 */
function createLecture() {
    // Retrieve the values from each of the input fields.
    var courseTitle = $('#courseTitle')[0].value;
    var lectureTitle = $('#lectureTitle')[0].value;
    var instructor = $('#instructor')[0].value;
    
    // Ensure something was entered for each field.
    if (!courseTitle || !lectureTitle || !instructor) {
        alert("Please enter information for the course title, lecture title,\
               and instructor.");
        return;
    }
    
    // Create a new lecture object with the specified values.
    var lecture = new Lecture();
    lecture.courseTitle = courseTitle;
    lecture.lectureTitle = lectureTitle;
    lecture.instructor = instructor;
    
    // Add the lecture.
    addLecture(lecture);
}

/**
 * Called when the Add Page button is clicked.
 */
function createPage() {
    // Clear the preview div.
    $('#previewDiv').empty();
    
    // Add a new page.
    addPage(new Page());
}


