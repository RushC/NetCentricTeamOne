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

/**
 * Called when a lecture textarea loses its focus.
 */
function modifyLecture() {
    // Ensure a lecture is currently selected.
    if (!currentLecture)
        return;
    
    // Set the current lecture's values.
    currentLecture.courseTitle = $('#courseTitle')[0].value;
    currentLecture.lectureTitle = $('#lectureTitle')[0].value;
    currentLecture.instructor = $('#instructor')[0].value;
    
    // Save the current lecture.
    saveLecture();
}

// function to create a new entity:
function newEntity(type) {
//    if (uploadInProgress || downloadInProgress)
//        return;
    // Ensure a page is selected.
    if (!currentPage) {
        alert("You must select a page before you can add an entity.");
        return;
    }
    
    // create a new entitiy:
    var entity = new Entity();
    // add it to the list
    entities.push(entity);
    // set the new entity to the current and update the ui to reflect the changes
    setCurrentEntity(entity);
}

//// function to create a draggable/resizable preview container for the currentEntity
//function createEntityPreview() {
//    // delete any elements with the id if they exist
//    $("#" + currentEntity.id).remove();
//    // create the container div
//    var container = $('<div class="entityContainerSelected" id=' + currentEntity.id + '><div></div></div>');
//    container.css({
//       width : currentEntity.width,
//       height : currentEntity.height,
//       overflow : "hidden",
//       position : "absolute"
//    });
//    container[0].offsetTop = currentEntity.entityY;
//    container[0].offsetLeft = currentEntity.entityX;
//    // add some classes to describe its role and enable functionality
//    
//    // add resize functionality
//    container.resizable({
//        containment : $("#outerPreviewDiv > fieldset"),
//        start : function(event, ui) {
//            // make sure this div represents the selected entity
//            // (shouldn't be a problem, but included for sake of robustness)
//            if (currentEntity.entityID != this.id) {
//                // find the current entity 
//            }
//        }, 
//    // add resize functionality
//    container.resizable({
//        containment : $("#outerPreviewDiv > fieldset"),
//        minWidth : 50,
//        minHeight : 50,
//        stop : function(event, ui) {
//            shouldDeselect = false;
//            console.log("sized");
//            resizeEntity();
//        }
//    });
//    // add drag functionality
//    container.draggable({
//        containment: $("#outerPreviewDiv > fieldset"),
//        stop: function(event, ui) { 
//            shouldDeselect = false;
//            console.log("moved");
//            moveEntity(); 
//        }
//    });
//    // apply deselection on mouse release if needed
//    container.click(function(event, ui){
//        console.log(shouldDeselect);
//        if (shouldDeselect)
//            deselectEntityContainer($(this));
//    });
//    // apply selection on mouse press
//    container.mousedown(function(event, ui) {
//        // indicate this container should be deselected if it was already selected
//        if ($(this).hasClass("entityContainerSelected"))
//            shouldDeselect =true;
//        else
//            shouldDeselect = false;
//        // deselect any selected containers
//        deselectEntityContainer($(".entityContainerSelected.ui-resizable"));
//        // select this container
//        selectEntityContainer($(this));
//        // set this container to as the current currentEntity if it wasn't already set
//        if (currentEntity.entityID != this.entityID) {
//            // indicate that this currentEntity shouldn't be deselected on mouse release
//            currentEntity = false;
//            // find the currentEntity with the id of the element and set it to the current currentEntity
//            for (var i = 0; i < entities.length; ++i)
//                if (entities[i].id == this.id)
//                    entity = entities[i];
//            // delete the element if there is no corresponding currentEntity
//            if (!currentEntity)
//                $(this).remove();
//            updatePropertyDiv();
//            updateEntityPreviewContent();
//        }
//    });
//    // add the div to the preview
//    $('#previewDiv').append(container);
//    // return the container
//    return container;
//}

/*
 * Called by an entity's preview container once it is done being dragged by the user
 * 
 * @param {Entity} entity - the entity to modify, defaults to current entity
 * @param {Number|String} x - the new horizontal offset measured from the left, defaults to 50
 * @param {Number|STring} y - the new vertical offset measured from the top, defaults to 50
 */
function moveEntity(x, y, entity) {
    entity = entity || currentEntity;
    // set the location of the entity
    currentEntity.entityX = x === undefined ? 50 : x;
    currentEntity.entityX = y === undefined ? 50 : y;
}

/**
 * Resizes the specified or currently selected entity to the given
 * width and height
 * 
 * @param {Entity} entity   - entity to modify, defaults to currentEntity
 * @param {Number|String} width - new width of entity, defaults to 50
 * @param {Number|String} height - new height of entity, defaults to 50
 */
function resizeEntity(entity, width, height) {
    // use the current entity if none was given
    entity = entity || currentEntity;
    // set the size of the entity
    entity.entityWidth = width === undefined ? 50 : width;
    entity.entityHeight = height === undefined ? 50 : height;
}


/*
 * Called by textInput and imageInput elements when changed to update its
 * corresponding entity's content as well as to trigger an update to the display
 * of that entity
 * 
 * @param {HTMLElement} element - the element that is emitting the event
 */
function updateEntityContent(element) {
    // get the entity this element corresponds to
    var entity = false;
    for (var i = 0; i < entities.length; i++)
        if (entities[i].entityID === element.getAttribute("entityID"))
            entity = entities[i];
    // handle if there is no such entity
    if (!entity) {
        console.log("Cannot find entity with ID=" + element.getAttribute(("entityID")));
        return;
    }
    
    // get the inner div where the content is inserted and create it if it doesn't exist (which shouldn't happen)
    var contentDiv = $("#"+entity.entityID + " > div.innerContentDiv");
    if (!contentDiv[0])
        contentDiv = $('<div class="innerContentDiv"></div>').appendTo(element);
    // perform the correct changes based on content type
    switch(entity.entityType) {
        case "textbox" :
        case "text" :
        case "bulletlist" :
        case "list" :
            entity.entityContent = $(element).val();
            displayEntity(entity);
            break;
        case "image" :
        case "img" :
            // get the preview image element
            var image = $("#imageInputPreview");
            // load the image file as a dataurl and make it the content and src for the entity and imgs respectively
            var reader = new FileReader();
            var file = $("input[type=file]")[0].files[0];
            if (file) {
                reader.onloadend = function() {
                    entity.entityContent = reader.result;
                    image[0].src = reader.result;
                    // update the entity preview
                    displayEntity(entity);
                };
                reader.readAsDataURL(file);
            }
            break;
        default:
            console.log("bad entity type: " + entity.entityType + " in updateEntityContent for " + element);
            break;
    }
}

//function updateEntityPreviewContent() {
//    if (currentEntity) {
//        // first get the contentContainer for the entity's preview
//        var contentContainer = $("#" + currentEntity.id + " > div");
//        // create the contentContainer if it doesn't exist:
//        if (!contentContainer[0])
//            contentContainer = createEntityPreview(currentEntity);
//        
//        // add/update the appropriate contents
//        switch(currentEntity.type) {
//            case "image" :
//                // get the image element in the contentContainer
//                var image = $("#"+currentEntity.id + " > img");
//                //empty the contentContainer and create a new image contentContainer if one doesn't exist"
//                if(!image[0]) {
//                    image = $("<img>");
//                    contentContainer.empty();
//                    contentContainer.append(image);
//                }
//                // set the image's source
//                image.src = currentEntity.content;
//                break;
//            case "textbox" :
//                // clear the current content of the contentContainer
//                contentContainer.empty();
//                // slice the content along line breaks so <br> tags are not needed
//                var lines = currentEntity.content.split(/(\r\n)|(^\r\n)/gm);
//                // add each entry to the contentContainer seperated by line breaks
//                for (var i = 0; i < lines.length; ++i)
//                    contentContainer.append("" + lines[i] + "<br>");
//                break;
//            case "bulletlist" :
//                // get the contentContainer for the entitiy:
//                var list = contentContainer.children("ul");
//                // empty the div and create a new list if one does'nt exist:
//                if(!list[0]) {
//                    contentContainer.empty();
//                    var list = $("<ul><ul>");
//                    contentContainer.append(list);
//                }
//                // empty the list:
//                list.empty();
//                // slice the content along line breaks to get the list entries:
//                var entries = currentEntity.content.split(/(\r\n|^\r\n)/gm);
//                // add each entry to the list:
//                for (var i = 0; i < entries.length; ++i)
//                    $("<li>"+entries[i]+"</li>").appendTo(list);
//        }
//    }
//}


