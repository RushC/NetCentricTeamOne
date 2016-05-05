////////////////////////////////////////////
// General Global variables               //
////////////////////////////////////////////
var currentLecture;             // current lecture being edited
var currentPage;                // current page being edited
var currentEntity;              // current entity being edited
var entityList = [];            // list of entities for the current page
var pageList = [];              // list of pages for this lecture
var uploadInProgress = false;   // true when uploading to the server
var downloadInProgress = false; // true when getting content from the server
var idPlaceHolder = "fakeID";   // used with fakeIDCount to generate ids for preview elements of new entities or pages
var fakeIDCount = 0;            // used to identify entities or pages without unique ids assigned by the server
var pageOverride = false;       // determines if moving a page to a sequence should delete the page already in that sequence
var shouldDeselect = false;     // indicates if completing a full click on a container should deselect it (as opposed to non deselecting it after moving/resizing)

////////////////////////////////////////////
// Commonly Referenced Elements           //
////////////////////////////////////////////
var pagePreviewDiv;             // div containing the page preview
var entityDiv;                  // div containing a list of entities on the current page
var ContentInputDiv;            // div containing the content input for an entity
var propertiesDiv;              // div containing the editable properties of the currently selected entity
//var xInput;                   // input for the currently selected entity's horizontal position on the page
//var yInput;                   // input for the currently selected entity's vertical position on the page
var zInput;                     // input for the currently selected entity's z-index based draw order
//var hInput;                   // input for the currently selected entity's height
//var wInput;                   // input for the currently selected entity's width
//var typeInput;                // input for the currentyl selected entity's type

///////////////////////////////////////////////////////////
// constructors for creating new lecture/page/entities  //
///////////////////////////////////////////////////////////
function Entity(me) {
    this.lectureID = me ? me.lectureID : currentLecture.id;
    this.pageID = me ? me.PageID : currentPage.id;
    this.type = me ? me.entityType : "textbox";
    this.id = me ? me.entityID : idPlaceHolder + fakeIDCount++;
    this.x = me ? me.entityX : 0; // LEAVE THIS AT 50
    this.y = me ? me.entityY : 0; // BECAUSE CSS
    this.z = me ? me.entityZ : 0;
    this.anim = me ? me.entityAnimation : "none";
    this.height = me ? me.entityHeight : 50;
    this.width = me ? me.entityWidth   : 50;
    this.content = me ? me.entityContent : "";
    this.status = me ? "unchanged" : "added";
    this.changed = me ? false : true;
}

function Lecture(ml) {
    this.id = ml ? ml.lectureID : idPlaceHolder + fakeIDCount++;
    this.lectureTitle = ml ? ml.lectureTitle : "Lecture Title";
    this.courseTitle = ml ? ml.courseTitle : "Course Title";
    this.instructor = ml ? ml.instructor : "Instructor Name";
    this.status = ml ? "unchanged" : "added";
}

function Page(mp) {
    this.id = mp ? mp.pageID : idPlaceHolder + fakeIDCount++;
    this.lectureID = mp ? mp.lectureID : currentLecture.id;
    this.seq = mp ? mp.pageSequence : "1";//pageCount;
    this.audio = mp ? mp.pageAudioURL : "";
    this.status = mp ? "unchanged" : "added";
}

////////////////////////////////////////////////////////////////////////////////////////////
// Constructors for objects that will translate into their java bean equivalents          //
//(need this because the json representation has to be exactly the same as the java class //
//- will not work if there are extra fields such as status)                               //
////////////////////////////////////////////////////////////////////////////////////////////
function ModelEntity(e) {
    this.lectureID = e.lectureID;
    this.pageID = e.pageID;
    this.entityID = e.id;
    this.entityType = e.type;
    this.entityX = e.x;
    this.entityY = e.y;
    this.entityZ = e.z;
    this.animation = e.anim;
    this.entityContent = e.content;
    this.entityWidth = e.width;
    this.entityHeight = e.height;
}

function ModelPage(s) {
    this.lectureID = s.lectureID;
    this.pageID = s.pageID;
    this.pageSequence = s.seq;
    this.pageAudioURL = s.audio;
}

function ModelLecture(l) {
    this.lectureID = l.id;
    this.lectureTitle = l.lectureTitle;
    this.courseTitle = l.courseTitle;
    this.instructor = l.instructor;
}
////////////////////////////////////////////
// Script Initialization                  //
////////////////////////////////////////////
window.onload = function() {
    pagePreviewDiv = $("#previewDiv");
    entityDiv = $("#entityDiv");
    ContentInputDiv = $("#contentEditDiv");
    propertiesDiv = $("#entityPropertiesDiv");
    //xInput = $("#xInput");
    //yInput = $("#yInput");
    zInput = $("#zInput");
    //hInput = $("#hInput");
    //wInput = $("#wInput");
    //typeInput = $("#typeInput");
    // check to make sure the element variables are non null
    var badElements = {
        "Missing Element pagePreviewDiv" : pagePreviewDiv,
        "Missing Element entityDiv" : entityDiv,
        "Missing Element ContentInputDiv" : ContentInputDiv,
        "Missing Element propertiesDiv" : propertiesDiv,
        //"Missing Element xInput" : xInput,
        //"Missing Element yInput" : yInput,
        "Missing Element zInput" : zInput,
        //"Missing Element hInput" : hInput,
        //"Missing Element wInput" : wInput,
        //"Missing Element typeInput" : typeInput
    };
    for (var e in badElements) {
        if (!badElements[e][0])
            console.log(e + "!");
    }
    
    // set the current entity, current page, and current lecture for testing purposes:
    currentLecture = new Lecture();
    currentLecture.id = "fakeLectureID";
    currentPage = new Page();
    currentEntity = new Entity();
    currentEntity.content = "Entity ONE";
    entityList.push(currentEntity);
    createEntityPreview();
    updateEntityPreviewContent();
    currentEntity = new Entity();
    currentEntity.content = "Entity TWO";
    entityList.push(currentEntity);
    createEntityPreview();
    updatePropertyDiv();
    updateEntityPreviewContent();
};


////////////////////////////////////////////
// Functions to communicate with server   //
////////////////////////////////////////////
// function to save the current page to the server:
function saveToServer() {
    //indicate that a save is in progress
    uploadInProgress = true;
    // define the action for the post
    if (currentPage.status == "added")
        action = "newPage";
    else if (currentPage.status == "deleted")
        action = "deletePage";
    else action = "updatePage";
    
    // create lists of newly added, changed, and deleted entities
    var addedEntities = [];
    var changedEntities = [];
    var deletedEntities = [];
    for (var i = 0; i < entityList.length; ++i) {
        if (entityList[i].status == "added")
            addedEntities.push(new ModelEntity(entityList[i]));
        else if (entityList[i].status == "deleted")
            deletedEntities.push(new ModelEntity(entityList[i]));
        else if (entityList[i].changed)
            changedEntities.push(new ModelEntity(entityList[i]));
    }
    
    // create lists of newly added, changed, and deleted pages
    var addedPages = [];
    var changedPages = [];
    var deletedPages = [];
    for (var i = 0; i < pageList.length; ++i) {
        if (pageList[i].status == "added")
            addedPages.push(pageList[i]);
        else if (pageList[i].status == "deleted")
            deletedPages.push(pageList[i]);
        else if (pageList[i].changed)
            changedPages.push(pageList[i]);
    }
        
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas(pagePreviewDiv, {
       onrendered: function(canvas) {
           console.log("Snapshot successful");
           
           // Set the page's image property to the data url from the canvas.
           currentPage.audio = canvas.toDataURL();
           
           // create and send the message
            $.post("/ShowAndTell/Controller", {
                "action" : "updateLecture",
                "lecture" : JSON.stringify(new ModelLecture(currentLecture)),
                "newEntities" : JSON.stringify(addedEntities),
                "changedEntities" : JSON.stringify(changedEntities),
                "deletedEntities" : JSON.stringify(deletedEntities),
                "newPages" : JSON.stringify(addedPages),
                "updatedPages" : JSON.stringify(changedPages),
                "deletedPages" : JSON.stringify(deletedPages)}, processSaveResponse);
            // set a timeout for 10s to alert user and reset awaitingResponse in case the server could not be reached/does not respond
            setTimeout(function() {
                if (uploadInProgress)
                    alert("Connection Timeout: unable to connect to server");
                uploadInProgress = false;
            }, 10000);
       } 
    });
}

function getEntities() {
    // Create a new model Page from the current page.
    var modelPage = new ModelPage(currentPage);
    console.log(modelPage);
    
    // Send a post request to retrieve the entitied from the database.
    $.post("/ShowAndTellProject/Controller", {
        action: "getEntities",
        page: JSON.stringify(modelPage)
        
    // Define the callback for the request.
    }).done(function(response) {
        
        // For debugging.
        console.log(entityList);
        
        // Set the download as finished.
        downloadInProgress = false;
    });
        
    // Specify that a download is in progress.
    downloadInProgress = true;
    
    // Set a timeout for the request.
    setTimeout(function() {
        // Check if the download is still in progress.
        if (downloadInProgress)
            // Raise an alert.
            alert("Error connecting to the server. Please try again later.");
        downloadInProgress = false;
    }, 10000);
}

/**
 * Retrieves all of the pages in the currently selected lecture by sending a
 * POST request to the server.
 */
function getLecture() {
    // Retrieve the lecture ID from the lecture dropbox.
    var lectureID = $(".dropdownHeader")[0].value;
    console.log(lectureID);
    
    // Create a new Lecture object with the Lecture ID.
    var lecture = new Lecture();
    lecture.id = lectureID;
    
    // Create a model lecture from the lecture object.
    var modelLecture = new ModelLecture(lecture);
    
    // Specify that a download is in progress.
    downloadInProgress = true;
    
    // Send a post request to retrieve the pages from the database.
    $.post("/ShowAndTellProject/Controller", {
        action: "getPages",
        lecture: JSON.stringify(modelLecture)
        
    // Define the callback for the request.
    }).done(processGetPagesResponse);
    
    // Set a timeout for the request.
    setTimeout(function() {
        // Check if the download is still in progress.
        if (downloadInProgress)
            // Raise an alert.
            alert("Error connecting to the server. Please try again later.");
        downloadInProgress = false;
    }, 10000);
}

function processSaveResponse(response) {
    var resp = JSON.parse(response);
    
    // reset the pageList
    pageList = [];
    for (var i; i < resp.pages.length; ++i) {
           pageList.push(new page(resp.pages[i]));
    } 
    // get the first page in sequence if the current page was deleted
    if (currentPage.status == "deleted") {
        var low = pageList[i];
        for (var i = 0; i < pageList.length; ++i)
            if (pageList[i].seq < low.seq)
                low = pageList[i];
        currentPage = low;
    }
    // get an updated list of the entities for this page:
    getEntities();
    // update ui elements
    regenPagePreview();
    updateEntitiesDiv();
    updatePropertyDiv();
    // done uploading
    uploadInProgress = false;
}

function processGetPagesResponse(response) {
    // The response should simply be the array of pages retrieved from the
    // request.
    var pages = response;

    // Reinitialize the page list as an empty array.
    pageList = [];

    // Iterate through all of the pages received from the response.
    for (var i = 0; i < pages.length; i++) {
        // Each page is equivalent to a ModelPage object. The pageList is
        // a list of regular Page objects. Convert the page to a Page
        // object by passing it to the Page constructor.
        var page = new Page(pages[i]);

        // Add the page to the list.
        pageList.push(page);
    }

    // For debugging.
    console.log(pageList);

    // Display the pages in the pages div.
    displayPages();

    // Set the download as finished.
    downloadInProgress = false;
}

function processGetEntitiesResponse(response) {
    // The response should simply be the array of entities retrieved from
    // the request.
    var entities = response;

    // Reinitialize the entity list as an empty array.
    entities = [];

    // Iterate through all of the pages received from the response.
    for (var i = 0; i < entities.length; i++) {
        // Each entity is equivalent to a ModelEntity object. The entityList 
        // is a list of regular Page objects. Convert the page to a Page
        // object by passing it to the Page constructor.
        var entity = new Entity(entities[i]);

        // Add the page to the list.
        entityList.push(entity);

        // Set the entity as the current entity.
        currentEntity = entity;

        // Update the preview with entity.
        updateEnityPreviewContent();
    }
    
    // For debugging.
    console.log(entityList);

    // Set the download as finished.
    downloadInProgress = false;
}

////////////////////////////////////////////
// Functions to modify pages              //
////////////////////////////////////////////

// function to change the sequence of a page to the given sequence
function setPageSeq() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the new sequence
    var seq = $("#sequenceInput").val();
    // find the page in the list at the sequece (if one exists)
    var swapPage = false;
    for (var i = 0; i < pageList.length; ++i)
        if (pageList[i].seq == seq)
            swapPage = pageList[i];
    // swap the old page if it exists
    if (swapPage) {
        swapPage.seq = currentPage.seq;
        swapPage.changed = true;
    }
    // set the new seq for the current page
    currentPage.seq = seq;
    currentPage.changed;
}

// function to change the audio URL of a page
function setPageAudioURL() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the new audio url
    var aurl = $("#audioURLInput").val();
    // set the url
    currentPage.audio = aurl;
    currentPage.changed = true;
}

// function to delete a page
function deletePage() {
    if (uploadInProgress || downloadInProgress)
        return;
    // ask the user if they are sure
    if (window.confirm("Deleting this page will also delete all entities on it and cause any pending changes to be saved to the server. Continue?")) {
        // set the page as deleted:
        currentPage.status = "deleted";
        // set the entities of this page to deleted:
        for (var i = 0; i < entityList.length; ++i) {
            if (entityList[i].status != "added") // if the entity isn't new, delete it
                entityList[i].status = "deleted";
            else { // otherwise set the entity to unchanged so it is ignored by the update
                entityList[i].status = "unchanged";
                entityList[i].changed = false;
            }
        }
        // save the current state and request another page to view:
        saveToServer();
    }
}

////////////////////////////////////////////
// Functions to modify entities           //
////////////////////////////////////////////

// function to create a new entity:
function newEntity(type) {
    if (uploadInProgress || downloadInProgress)
        return;
    // create a new entitiy:
    currentEntity = new Entity();
    // add it to the list
    entityList.push(currentEntity);
    // set the type to text
    currentEntity.type = type;
    // add the entity to the list:
    entityList.push(currentEntity);
    // update the property div
    updatePropertyDiv();
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
    container[0].offsetTop = currentEntity.y;
    container[0].offsetLeft = currentEntity.x;
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
        if (currentEntity.id != this.id) {
            // indicate that this currentEntity shouldn't be deselected on mouse release
            currentEntity = false;
            // find the currentEntity with the id of the element and set it to the current currentEntity
            for (var i = 0; i < entityList.length; ++i)
                if (entityList[i].id == this.id)
                    entity = entityList[i];
            // delete the element if there is no corresponding currentEntity
            if (!currentEntity)
                $(this).remove();
            updatePropertyDiv();
            updateEntityPreviewContent();
        }
    });
    // add the div to the preview
    pagePreviewDiv.append(container);
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
    if (uploadInProgress || downloadInProgress)
        return;
    // get element representing the current entity
    var element = $("#" + currentEntity.id);
    // set the location of the entity as the location of the entity
    currentEntity.x = element[0].offsetLeft;
    currentEntity.y = element[0].offsetTop;
    
    // set the current entity as changed
    currentEntity.changed = true;
}

// function to change the size of an entity:
function resizeEntity() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the preview container for the entity
    var container = $("#" + currentEntity.id);
    // set the entities width and height to those of the container
    console.log("TEST");
    currentEntity.width = container.width();
    currentEntity.height = container.height();
}


////////////////////////////////////////////
// Functions to handle UI elements        //
////////////////////////////////////////////

// Function that does exactly as it says on the tin:
function updatePropertyDiv() {
    if (currentEntity) { //if the current entity is defined
        // Set all the properties equal to those of the entity:
        //xInput.val(currentEntity.x);
        //yInput.val(currentEntity.y);
        zInput.val(currentEntity.z);
        //animationInput.val = currentEntity.anim;
        // fill the content div with the appropriate elements based on the entity type:
        ContentInputDiv.empty();
        switch(currentEntity.type) {
            case "image" : // create an image preview and a image loader if the entity is an image
                // set the type input first:
                //typeInput[0].selectedIndex = 3;
                // create and add the components for the content div:
                var fileButton = $('<input type="file">');
                var image = $('<img>');
                image.hide();
                fileButton[0].onchange = function () {
                    var reader = new FileReader();
                    var file = $("input[type=file]")[0].files[0];
                    if (file) {
                        reader.onloadend = function() {
                            image[0].src = reader.result;
                            currentEntity.content = reader.result;
                            image[0].width = 50;
                            image[0].height = 50;
                        };
                        reader.readAsDataURL(file);
                    }
                };
                
                ContentInputDiv.append(fileButton);
                ContentInputDiv.append(image);
                break;
                
            // create a basic text box if the input is a text box or list:
            case "textbox" :
            case "bulletlist" :
                // set the type input selector first:
//                if(currentEntity.type == "textbox")
//                    typeInput[0].selectedIndex = 1;
//                else
//                    typeInput[0].selectedIndex = 2;
                var textContent = $('<textarea rows="5" cols="20" class="lectureInput" id="textInput" placeholder="Enter text here. HTML can be used to style the display"></textarea>');
                textContent.text(currentEntity.content);
                textContent.change(function(event, ui) {
                    console.log($(this).val());
                    currentEntity.content = $(this).val();
                    updateEntityPreviewContent();
                });
                ContentInputDiv.append(textContent);
                break;
            default :
                console.log("Bad Entity Type" + currentEntity.type);
                break;
        }
    // otherwise reset all values to default:
    } else {
        zInput.val(0);
        ContentInputDiv.hide();
        ContentInputDiv.empty();
    }
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

// function to generate a preview for each entity in entityList
function updatePagePreview() {
    // clear whatever was in the page preview
    pagePreviewDiv.empty();
    // for each entity in the entity list
    for (var i = 0; i < entityList.length; ++i) {
        // set this entity as current
        currentEntity = entityList[i];
        // update the preview for this entity (will create the preview for it)
        createEntityPreview();
        updateEntityPreviewContent();
    }
    // after the last entity has been added, update the properties panel
    updatePropertyDiv(true);
        
}

/**
 * Displays the list of pages in the pages div element.
 */
function displayPages() {
    // Retrieve the the pages div element.
    var $pageDiv = $("#pageDiv");
    
    // Clear the page div.
    while ($pageDiv[0].firstChild)
        $pageDiv[0].removeChild($pageDiv[0].firstChild);
    
    // Iterate through all of the pages in the pagesList.
    for (var i = 0; i < pageList.length; i++) {
        var page = pageList[i];
        
        // Create a new image element to represent the page.
        var img = document.createElement("IMG");
        img.onload = function() {
            $(this).hide().pageToggle();
        };
        img.src = "/ShowAndTellProject/" + page.audio;
        img.id = "pageThumbnail";
        
        // Add highlight functionality to the image element.
        highlight(img);
        
        // Add the image to the pages div.
        $pageDiv.append(img);        
    }
}

/**
 * Constructs a snapshot of the page preview div and sets its image content to a
 * data URL for an image of the screenshot.
 *
 * @param {page} the Page object currently diplayed in the page preview div.
 */
function pageSnapshot(page) {
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas(pagePreviewDiv, {
       onrendered: function(canvas) {
           console.log("Snapshot successful");
           
           // Set the page's image property to the data url from the canvas.
           page.audio = canvas.toDataURL();
           page.lectureID = "1";
           
           // Sends a new post request for the new page.
           var lecture = new Lecture();
           lecture.courseTitle = "Course";
           lecture.instructor = "Instructor";
           lecture.lectureTitle = "Lecture";
           lecture.id = "1";
           var newPages = [ new ModelPage(page) ];
           $.post("/ShowAndTellProject/Controller", {
                action: "updateLecture",
                newPages: JSON.stringify(newPages),
                updatedPages: JSON.stringify([]),
                deletedPages: JSON.stringify([]),
                newEntities: JSON.stringify([]),
                updatedEntities: JSON.stringify([]),
                deletedEntities: JSON.stringify([]),
                lecture: JSON.stringify(new ModelLecture(lecture))
            });
       } 
    });
    
    console.log("In Snapshot");
}





























