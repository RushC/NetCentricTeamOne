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
    currentEntity = new Entity();
    // add it to the list
    entities.push(currentEntity);
    // set the type to text
    currentEntity.entityType = type;
    // add the entity to the list:
    //entities.push(currentEntity);
    // update the property div
    //updatePropertyDiv();
    // create a new entity container
    createEntityPreview(currentEntity);
    // update the preview
    updateEntityPreviewContent();
}

// function to create a draggable/resizable preview container for the currentEntity
function createEntityPreview() {
    // delete any elements with the id if they exist
    $("#" + currentEntity.id).remove();
    // create the container div
    var container = $('<div class="entityContainerSelected" id=' + currentEntity.id + '><div></div></div>');
    container.css({
       width : currentEntity.width,
       height : currentEntity.height,
       overflow : "hidden",
       position : "absolute"
    });
    container[0].offsetTop = currentEntity.entityY;
    container[0].offsetLeft = currentEntity.entityX;
    // add resize functionality
    container.resizable({
        containment : $("#outerPreviewDiv > fieldset"),
        minWidth : 50,
        minHeight : 50,
        stop : function(event, ui) {
            shouldDeselect = false;
            console.log("sized");
            resizeEntity();
        }
    });
    // add drag functionality
    container.draggable({
        containment: $("#outerPreviewDiv > fieldset"),
        stop: function(event, ui) { 
            shouldDeselect = false;
            console.log("moved");
            moveEntity(); 
        }
    });
    // apply deselection on mouse release if needed
    container.click(function(event, ui){
        console.log(shouldDeselect);
        if (shouldDeselect)
            deselectEntityContainer($(this));
    });
    // apply selection on mouse press
    container.mousedown(function(event, ui) {
        // indicate this container should be deselected if it was already selected
        if ($(this).hasClass("entityContainerSelected"))
            shouldDeselect =true;
        else
            shouldDeselect = false;
        // deselect any selected containers
        deselectEntityContainer($(".entityContainerSelected.ui-resizable"));
        // select this container
        selectEntityContainer($(this));
        // set this container to as the current currentEntity if it wasn't already set
        if (currentEntity.entityID != this.entityID) {
            // indicate that this currentEntity shouldn't be deselected on mouse release
            currentEntity = false;
            // find the currentEntity with the id of the element and set it to the current currentEntity
            for (var i = 0; i < entities.length; ++i)
                if (entities[i].id == this.id)
                    entity = entities[i];
            // delete the element if there is no corresponding currentEntity
            if (!currentEntity)
                $(this).remove();
            updatePropertyDiv();
            updateEntityPreviewContent();
        }
    });
    // add the div to the preview
    $('#previewDiv').append(container);
    // return the container
    return container;
}

// function to enable entity preview container selection and the
// resizable features that go with it
function selectEntityContainer(container) {
    // enable resizing
    container.resizable("enable");
    // show resizing handle
    container.find(".ui-resizable-handle").show();
    // turn on selection border
    container.addClass("entityContainerSelected");
}

// function to disable entity preview container selection and the
// resizable features that go with it
function deselectEntityContainer(container) {
    // disable resizing
    container.resizable("disable");
    // hide resizing handle
    container.find(".ui-resizable-handle").hide();
    // turn off selection border
    container.removeClass("entityContainerSelected");
}

// function to move an entity:
function moveEntity() {
//    if (uploadInProgress || downloadInProgress)
//        return;
    // get element representing the current entity
    var element = $("#" + currentEntity.entityID);
    // set the location of the entity as the location of the entity
    currentEntity.entityX = element[0].offsetLeft;
    currentEntity.entityX = element[0].offsetTop;
    
    // set the current entity as changed
    currentEntity.changed = true;
}

// function to change the size of an entity:
function resizeEntity() {
//    if (uploadInProgress || downloadInProgress)
//        return;
    // get the preview container for the entity
    var container = $("#" + currentEntity.entityID);
    // set the entities width and height to those of the container
    console.log("TEST");
    currentEntity.width = container.width();
    currentEntity.height = container.height();
}

// function to update the current entity's representation on the page preview
function updateEntityPreviewContent() {
    if (currentEntity) {
        // first get the contentContainer for the entity's preview
        var contentContainer = $("#" + currentEntity.id + " > div");
        // create the contentContainer if it doesn't exist:
        if (!contentContainer[0])
            contentContainer = createEntityPreview(currentEntity);
        
        // add/update the appropriate contents
        switch(currentEntity.type) {
            case "image" :
                // get the image element in the contentContainer
                var image = $("#"+currentEntity.id + " > img");
                //empty the contentContainer and create a new image contentContainer if one doesn't exist"
                if(!image[0]) {
                    image = $("<img>");
                    contentContainer.empty();
                    contentContainer.append(image);
                }
                // set the image's source
                image.src = currentEntity.content;
                break;
            case "textbox" :
                // clear the current content of the contentContainer
                contentContainer.empty();
                // slice the content along line breaks so <br> tags are not needed
                var lines = currentEntity.content.split(/(\r\n)|(^\r\n)/gm);
                // add each entry to the contentContainer seperated by line breaks
                for (var i = 0; i < lines.length; ++i)
                    contentContainer.append("" + lines[i] + "<br>");
                break;
            case "bulletlist" :
                // get the contentContainer for the entitiy:
                var list = contentContainer.children("ul");
                // empty the div and create a new list if one does'nt exist:
                if(!list[0]) {
                    contentContainer.empty();
                    var list = $("<ul><ul>");
                    contentContainer.append(list);
                }
                // empty the list:
                list.empty();
                // slice the content along line breaks to get the list entries:
                var entries = currentEntity.content.split(/(\r\n|^\r\n)/gm);
                // add each entry to the list:
                for (var i = 0; i < entries.length; ++i)
                    $("<li>"+entries[i]+"</li>").appendTo(list);
        }
    }
}


