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
 * Displays the specified entity object in the preview div.
 * 
 * @param {Entity} entity - the entity object to display.
 */
function displayEntity(entity) {
    // If an entity was not passed, use the currentEntity by default.
    entity = entity || currentEntity;
    
    // TODO.
}

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
        ul.id = lecture.lectureID;
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
        img.class = "pageThumbnail";
        img.id = page.pageID;
        
        // Load the page's image.
        img.onload = function() {
            // Animate the image in.
            $(this).hide().slideDown();
        };
        img.src = "/ShowAndTellProject/" + page.pageAudioURL;
        
        // Add highlight and select styling to the image.
        highlight(img);
        select(img);
        
        // Add an event listener to listen for when the img is selected.
        img.onselect = (function() {
            // Use a closure to save the index at this iteration.
            var index = i;
            return function() {
                // Set the currentSlide.
                currentPage = pages[index];

                // Load the new entities.
                loadEntities();

                console.log(currentPage);
            };
        })();
        
        // Add the image to the page div.
        $pageDiv.append(img);
    }
}

/**
 * Removes the specified entity from the previewDiv.
 * 
 * @param {Entity} entity an Entity object to remove. If not supplied, the
 *                 currentEntity will be removed.
 */
function removeEntity(entity) {  
    loadEntities();
}

/**
 * Removes all of the entities in the list from the preview div.
 */
function removeEntities() {
    // Iterate backwards through the list of entities.
    for (var i = entities.length - 1; i >= 0; i--)
        // Remove each entity.
        removeEntity(entities[i]);
}

/**
 * Removes the specified lecture object.
 * 
 * @param {Lecture} lecture the lecture object to remove from the page. If not
 *                  supplied, the currentLecture will be removed.
 */
function removeLecture(lecture) {
    // Remove the currenLecture if no argument was supplied.
    lecture = lecture || currentLecture;
        
    // Clear the lecture info fields and pages.
    if (lecture === currentLecture) {
        $('#courseTitle').val("");
        $('#lectureTitle').val("");
        $('#instructor').val("");
        currentLecture = null;
        removePages();
    }
    
    loadLectures();
}

/**
 * Removes the specified page object.
 * 
 * @param {Page} page the page object from the page.
 */
function removePage(page) {
    // Remove the currentPage if no argument was supplied.
    page = page || currentPage;
    
    // Remove the img element representing the page.
    $('img#' + page.pageID).slideUp();
    
    // Clear the previewDiv.
    if (page === currentPage) {
        removeEntities();
        currentPage = null;
    }
}

/**
 * Removes all of the Pages from the webpage.
 */
function removePages() {
    // Iterate backwards through the list of pages.
    for (var i = pages.length - 1; i >= 0; i--)
        // Remove each page.
        removePage(pages[i]);
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
    $('#courseTitle').val(currentLecture.courseTitle);
    $('#lectureTitle').val(currentLecture.lectureTitle);
    $('#instructor').val(currentLecture.instructor);
    
    // Load the pages for the selected Lecture.
    loadPages();
}


