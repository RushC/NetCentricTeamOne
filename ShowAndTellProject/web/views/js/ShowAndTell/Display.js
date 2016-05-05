/* 
 * This script defines the different objects that are available to the page
 * and the functions for displaying them.
 */

var currentEntity;  // The currently selected Entity.
var currentLecture; // The currently selected Lecture.
var currentPage;    // The currently selected Page.
var entities = [];       // All of the Entities in the current Page.
var lectures;       // All of the Lectures in the database.
var pages;          // All of the Pages in the current Lecture.



/**
 * Creates a div to hold the preview content for the given entity then adds it
 * to the preview div
 * Should be called by displayEntity
 * 
 * @param {Entity} entity
 * @returns {JquerySelection} JQuery Selection containing the created div
 */
function createPreviewContainer(entity) {
    // requires an entity to be passed, return null if non given
    if (!entity)
        return null;
    // create the div - the outer div has the ui functionality while the inner holds the entity content
    var div = $('<div class="entityContainerSelected" id=' + entity.entityID + '><div></div></div>');
    // size and position the div
    div.css({
       width : entity.entityWidth,
       height : entity.entityHeight
    });
    div[0].offsetTop = entity.entityY;
    div[0].offsetLeft = entity.entityX;
    // add some classes to describe its role and enable functionality and style
    div.addClass("entiyContainer"); // Style for all entity container divs
    div.addClass("entityContainerSelected"); // Style and functionality for selected entity containers
    div.addClass(entity.entityType + "EntityContainer"); // Style for representing this entity's type of content
    // add resizing functionality
    div.resizable({
        // contain to outer preview div instead of inner because... css
        containment : $("#outerPreviewDiv > fieldset"),
        start : function(event, ui) {
            // make sure this container represents the current entity
            // (shouldn't be an issue, included for sake of robustness)
            if (this.id != currentEntity.entityID) { // if not the div for the current entity
                // get and deselect the current entity's div 
                $("#" + currentEntity.entityID)
            }
        },
        stop : function(event, ui) {
            // indicate that the element should not be deselected when the mouse is released
            $(this).removeClass("shouldDeselect");
            // if the current entity 
            resizeEntity($(this).width(), $(this).height());
        }
    });

}

/**
 * Displays the properties for the given (or current) entity in the
 * entityPropertiesDiv
 * 
 * @param {Entity} entity - the entity whose properties will be displaed, or null
 *      to use currentEntity
 */
function displayEntityProperties(entity) {
    entity = entity || currentEntity;
    // get the properties div
    var display = $("#entityPropertiesDiv");
    // hide the div if no entity is specified and none are selected
    if (!entity) {
        display.hide("slow");
    }
    // otherwise fill in the properties for the display
    else {
        display.children("#zInput").val(entity.entityZ);
        display.children("#animInput")[0].value = entity.animation;
        // generate the contentEditDiv
        var contentEditDiv = display.children("#contentEditDiv");
        contentEditDiv.empty();
        switch(entity.entityType) {
            case "textbox" :
            case "text" : // same as textbox, couln't remember if text was used at some point instead
            case "bulletlist" :
                // create a textarea for input
                var textContent = $('<textarea rows="5" cols="20" class="lectureInput"></textarea>');
                textContent[0].name = entity.entityID; // set the name to the id so it can update the appropriate entity
                if (entity.entityType === "bulletlist")
                    textContent[0].placeholder = "Enter list items here, seperated by new lines. HTML can be used to stylize the display";
                else
                    textContent[0].placeholder = "Enter text here. HTML can be used to style the display";
                textContent.text(entity.entityContent);
                textContent.change(function(event, ui) {
                    // get the entity this textarea represents
                    var thisEntity = false;
                    for (var i = 0; i < entities.length; i++)
                        if (entities[i].entityID === this.name)
                            thisEntity = entities[i]; 
                    if (thisEntity){ // if this entity exists
                        currentEntity.content = $(this).val();
                        displayEntity(currentEntity);
                    } else // if it doesn't, complain in console
                        console.log("textInput cannot find entity with ID " + this.name + " to update content!");
                });
                break;
            case "image" :
            case "img"  : // similar for textbox/text...so many things to keep track of...
                
                
        }
    }
}
/**
 * Displays the specified entity object in the preview div.
 * 
 * @param {Entity} entity - the entity object to display.
 */
function displayEntity(entity) {
    // If an entity was not passed, use the currentEntity by default.
    entity = entity || currentEntity;
    
    // find the div for the entity
    var div = $("#previewDiv > #" + entity.entityID);
    // if the 
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
 * Displays the specified page.
 * 
 * @param {Page} page the Page object to display. If this is not specified,
 *               the current page will be used.
 */
function displayPage(page) {
    // Use the currentPage by default.
    page = page || currentPage;
            
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
        // Use a closure to save the page at this iteration.
        var p = page;
        return function() {
            // Set the currentSlide.
            currentPage = p;

            // Load the new entities.
            loadEntities();

            console.log(currentPage);
        };
    })();

    // Add the image to the page div.
    $('#pageDiv').append(img);
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
    for (var i = 0; i < pages.length; i++)
        displayPage(pages[i]);
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


