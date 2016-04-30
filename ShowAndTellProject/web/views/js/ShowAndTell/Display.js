/* 
 * This script defines the different objects that are available to the page
 * and the functions for displaying them.
 */

var currentEntity;  // The currently selected Entity.
var currentLecture; // The currently selected Lecture.
var currentPage;    // The currently selected Page.
var entities;       // All of the Entities in the current Page.
var lectures;       // All of the Lectures in the database.
var pages;          // All of the Pages in the current Lecture.

/**
 * Displays all of the Entities in the preview div.
 */
function displayEntities() {
    // TODO
}

/**
 * Displays all of the Lectures in the Lecture dropdown.
 */
function displayLectures() {
    // Retrieve the lecture dropdown.
    var $lectureDropdown = $('#lectureDropdown');
    
    // Clear the contents of the dropdown.
    $lectureDropdown.empty();
    
    // Add a header to the dropdown.
    var header = document.createElement('h3');
    header.innerHTML = 'Select A Lecture';
    $lectureDropdown.append(header);
    
    // Iterate through all of the lecture objects.
    for (var i = 0; i < lectures.length; i++) {
        var lecture = lectures[i];
        
        // Add a ul element to the lectureDropdown to represent each lecture.
        var ul = document.createElement('ul');
        ul.innerHTML = lecture.courseTitle + ": " + lecture.lectureTitle;
        $lectureDropdown.append(ul);
        
        // Set the value of the ul item to the index of the lecture.
        ul.value = i;
        
        // Add highlight styling to the ul item.
        highlight(ul);
    }
    
    // Apply the dropdown styling to the dropdown.
    dropdown($lectureDropdown[0]);
}

/**
 * Displays all of the pages in the page div.
 */
function displayPages() {
    // Retrieve the page div.
    var $pageDiv = $('#pageDiv');
    
    // Clear the contents of the div.
    $pageDiv.empty();
    
    // Iterate through all of the page objects.
    for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        
        // Create an image element to represent the page.
        var img = document.createElement('img');
        img.id = "pageThumbnail";
        
        // Load the page's image.
        img.onload = displayPages.imageLoaded;
        img.src = "/ShowAndTellProject/" + page.pageAudioURL;
        
        // Add highlight and select styling to the image.
        highlight(img);
        select(img);
        
        // Add the image to the page div.
        $pageDiv.append(img);
    }
    
    // The function called when an image is loaded.
    displayPages.imageLoaded = function() {
        // Animate the image in.
        $(this).hide().slideDown();
    };
}

/**
 * Sets the current lecture based on the currently selected lecture in the
 * lecture dropdown.
 */
function setLecture() {
    // Retrieve the lecture dropdown value.
    var lectureDropdownValue = $('#lectureDropdown>.dropdownHeader')[0].value;
    
    // Retrieve the currently selected lecture object using the value.
    currentLecture = lectures[lectureDropdownValue];
    
    // Set each of the fields to the current lecture's data.
    $('#courseTitle').html(currentLecture.courseTitle);
    $('#lectureTitle').html(currentLecture.lectureTitle);
    $('#instructor').html(currentLecture.instructor);
    
    // Load the pages for the selected Lecture.
    loadPages();
}


