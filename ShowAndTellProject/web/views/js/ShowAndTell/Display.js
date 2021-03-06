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
 * @returns {JquerySelector} JQuerySelector containing the created div
 */
function createPreviewContainer(entity) {
    // requires an entity to be passed, return null if non given
    if (!entity)
        return null;
    console.log("this function was called");
    var index = entities.indexOf(entity);
    // create the div - the outer div has the ui functionality while the inner holds the entity content
    var div = $('<div id="entity' + index + '"></div>');
    // size and position the div
    
    // add some classes & attributes to describe its role and enable functionality and style
    div.addClass("entityContainer"); // Style for all entity container divs
    div.addClass(entity.entityType + "EntityContainer"); // for defining style specific to content type
    div.attr("entityIndex", index);
    // add resizing functionality
    div.resizable({
        // contain to outer preview div instead of inner because... css
        containment : $("#outerPreviewDiv > fieldset"),
        start : function(event, ui) {
            // set the entity as the current entity
            setCurrentEntity(entities[$(this).attr("entityIndex")]);
        },
        stop : function(event, ui) {
            // resize the entity  
            resizeEntity($(this).width(), $(this).height(), entities[$(this).attr("entityIndex")]);
            //saveEntity(entities[$(this).attr("entityIndex")]);
        }
    });
    // add dragging functionality
    div.draggable({
        start : function(event, ui) {
            // set the entity as the current entity
            setCurrentEntity(entities[$(this).attr("entityIndex")]);
        },
        stop : function(event, ui) {
            // move the entity
            moveEntity(this.offsetLeft, this.offsetTop, entities[$(this).attr("entityIndex")]);
        }
    });
    // add selection on click
    div.click(function(event, ui) {
       // select the entity and set it as current
       setCurrentEntity(entities[$(this).attr("entityIndex")]);
       
    });
    // add the inner div
    div.append('<div class="innerContentDiv"></div>');
    // add div to the preview
    div.appendTo($("#previewDiv"));
    div[0].style.width = entity.entityWidth + "px";
    div[0].style.height = entity.entityHeight + "px";
    div[0].style.position = "absolute";
    div[0].style.left = entity.entityX + "px";
    div[0].style.top  = entity.entityY + "px";
    console.log('Div styling');
    console.log(div[0]);
    console.log(entity);

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
        display.children("#animInput").html(entity.animation);
        // generate the contentEditDiv
        var contentEditDiv = display.children("#contentEditDiv");
        //contentEditDiv.empty();
        switch(entity.entityType) {
            case "textbox" :
            case "text" : // same as textbox, couln't remember if text was used at some point instead
            case "bulletlist" :
                // hide any image input elements
                contentEditDiv.children(".imageEntityInput").hide();
                // get the textInput element
                var textContent = contentEditDiv.children("#textInput");
                // set the entityIndex of the element to that of the entity
                textContent.attr("entityIndex", entities.indexOf(entity));
                // set the appropriate place holder
                if (entity.entityType === "bulletlist")
                    textContent[0].placeholder = "Enter list items here, seperated by new lines. HTML can be used to stylize the display";
                else
                    textContent[0].placeholder = "Enter text here. HTML can be used to style the display";
                // set the text
                textContent.text(entity.entityContent);
                // show related textInput elements
                contentEditDiv.children(".textEntityInput").show();
                break;
            case "image" :
            case "img"  : // similar for textbox/text...so many things to keep track of...
                // hide any text input elements
                contentEditDiv.children(".textEntityInput").hide();
//                // hide the preview if the entity has no content
//                if (entity.entityContent.length == 0)
//                    contentEditDiv.find("#imageInputPreview").hide();
//                else
                    contentEditDiv.find("#imageInputPreview").show().attr("src", entity.entityContent);
                // set the entityIndex for the imageInput to that of the entity
                contentEditDiv.find("#imageInput").attr("entityIndex", entities.indexOf(entity));   
                // show related imageInput elements
                contentEditDiv.children(".imageEntityInput").show();
                break;
            default:
                    console.log("bad entity type: " + entity.entityType);
                    return;
        }
        // show the properties div if it was hidden
        if (display.css("display") == "none")
            display.show("slow");
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
    var index = entities.indexOf(entity);
    if (index == -1){
        //alert("fuck");
        return;
    }
    // find the div for the entity and create it if it doesn't exist
    var div = $("#previewDiv > #entity" + entities.indexOf(entity));
    if (!div[0]) {
        createPreviewContainer(entity);
        div = $("#previewDiv > #entity" + entities.indexOf(entity));
    }
    
    // get the inner div where the content is inserted and create it if it doesn't exist
    var contentDiv = $("#entity"+entities.indexOf(entity) + " > div.innerContentDiv");
    // perform the correct changes based on content type
    switch(entity.entityType) {
        case "textbox" :
        case "text" :
            // clear the old content
            contentDiv.empty();
            // add the new content within a <pre> element to preserve formatting
            $("<pre></pre>").html(entity.entityContent).appendTo(contentDiv);
            break;
        case "bulletlist" :
        case "list" :
            // clear the old content
            contentDiv.empty();
            // seperate the contents into list items by line breaks
            var items = entity.entityContent.split(/\r?\n/gm);
            // add each item to the contentDiv as an entry to an unordered list
            var list = $("<ul></ul>");
            list[0].style.textAlign = "left";
            for (var i = 0; i < items.length; i++)
                $("<li></li>").html(items[i]).appendTo(list);
            // add the list to the contentDiv
            contentDiv.append(list);
            break;
        case "image" :
        case "img" :
            // get the image element for in the preview div or create it if needed
            var image = contentDiv.children("img");
            if (!image[0])
                image = $('<img width="100%" height="100%">').appendTo(contentDiv);
            // set the src of the image to the entity's content
            image.attr("src", entity.entityContent);
            break;
    }
}

/**
 * Displays all of the Entities in the preview div.
 */
function displayEntities() {
    // clear the preview div
    $("#previewDiv").empty();
    // dispaly each entity in the entities list
    for (var i = 0; i < entities.length; i++) {
        displayEntity(entities[i]);
    }
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
        console.log("This is a page: ");
        console.log(page);
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
    
    location.href = location.href;
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

function removeEntity() {
    loadEntities();
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
 * Changes the given entity container's appearance and functionality to that of
 * a selected entity containera
 * 
 * Does nothing if no container is passed or the selection is empty
 * 
 * @param {JQuerySelector} container - the div containing an entitie's preview 
 */
function selectEntityContainer(container) {
    if(!container[0])
        return;
    // enable resizing
    //container.resizable("enable");
    // show resizing handle
    //container.find(".ui-resizable-handle").show();
    // turn on selection border
    container.addClass("entityContainerSelected");
}

/**
 * Changes the given entity container's appearance and functionality to that of
 * an unselected entity container
 * 
 * Does nothing if no container is passed or the selection is empty
 * 
 * @param {JQuerySelector} container - the div containing an entitie's preview 
 */
function deselectEntityContainer(container) {
    if(!container[0])
        return;
    // disable resizing
    //container.resizable("disable");
    // turn off selection border
    container.removeClass("shouldDeselect");
    container.removeClass("entityContainerSelected");
    saveEntity(entities[container.attr("entityID")]);
}

/**
 * clear entities from preview div
 */
function removeEntities() {
    $("#previewDiv").empty();
    entities = [];
    currentEntity = null;
}
/**
 * Sets the current entity and performs the neccessary UI updates to reflect
 * the change.
 * 
 * Also checks to ensure the entity is of the current page and lecture and will
 * return false (fail) if this is not the case.
 * 
 * Does not check to ensure if the entity is part of the entities list.
 * 
 * @param {Entity} entity - the entity to be swapped in for the current
 * @returns {bool} true if successful, false otherwise
 */
function setCurrentEntity(entity) {
    if (!entity)
        return;
    // save and deselect the old currentEntity
    if (currentEntity && currentEntity != entity){
        deselectEntityContainer($("#entity" + entities.indexOf(currentEntity)));
    }
    // set the current entity to the new one and select it
    currentEntity = entity;
    // save the new entity
    //saveEntity();
    // generate/update the properties div for the new entity
    displayEntityProperties();
    // generate/update the preview for the entity
    displayEntity();
    // select the entity's container
    selectEntityContainer($("#entity"+entities.indexOf(entity)));
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


