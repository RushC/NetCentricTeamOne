////////////////////////////////////////////
// General Global variables               //
////////////////////////////////////////////
var currentLecture;             // current lecture being edited
var currentPage;                // current page being edited
var currentEntity;              // current entity being edited
var entityList = [];            // list of entities for the current page
var pageList = [];             // list of pages for this lecture
var uploadInProgress = false;   // true when uploading to the server
var downloadInProgress = false; // true when getting content from the server
var idPlaceHolder = "fakeID";   // used with fakeIDCount to generate ids for preview elements of new entities or pages
var fakeIDCount = 0;            // used to identify entities or pages without unique ids assigned by the server
var pageOverride = false;      // determines if moving a page to a sequence should delete the page already in that sequence

////////////////////////////////////////////
// Commonly Referenced Elements           //
////////////////////////////////////////////
var pagePreviewDiv;            // div containing the page preview
var entityDiv;                // div containing a list of entities on the current page
var ContentInputDiv;            // div containing the content input for an entity
var propertiesDiv;           // div containing the editable properties of the currently selected entity
//var xInput;                     // input for the currently selected entity's horizontal position on the page
//var yInput;                     // input for the currently selected entity's vertical position on the page
var zInput;                     // input for the currently selected entity's z-index based draw order
//var hInput;                     // input for the currently selected entity's height
//var wInput;                     // input for the currently selected entity's width
//var typeInput;                  // input for the currentyl selected entity's type

///////////////////////////////////////////////////////////
// constructors for creating new lecture/page/entities  //
///////////////////////////////////////////////////////////
function Entity(me) {
    this.lectureID = me ? me.lectureID : currentLecture.id;
    this.pageID = me ? me.PageID : currentPage.id;
    this.type = me ? me.entityType : "textbox";
    this.id = me ? me.entityID : idPlaceHolder + fakeIDCount++;
    this.x = me ? me.entityX : 0;
    this.y = me ? me.entityY : 0;
    this.z = me ? me.entityZ : 0;
    this.anim = me ? me.entityAnimation : "none";
    this.height = me ? me.entityHeight : 0;
    this.width = me ? me.entityWidth   : 0;
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
// Functions to modify pages             //
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
function newEntity() {
    if (uploadInProgress || downloadInProgress)
        return;
    // Reset the properties values:
    xInput.val = 0;
    yInput.val = 0;
    zInput.val = 0;
    typeInput[0].selectedIndex = 0;
    ContentInputDiv.empty();
    // make sure the properties div is showing
    propertiesDiv.show();
    // create a new entitiy:
    currentEntity = new Entity();
    // add the entity to the list:
    entityList.push(currentEntity);
    
    
}

// function to move an entity:
function moveEntity() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the x y and z values:
    var x = xInput.val;
    var y = yInput.val;
    var z = zInput.val;
    
    // get the entity's preview div
    var preview = $("#" + currentEntity.id);
    $("#"+currentEntity.id).animate({top: y, left: x, "z-index": z});
    console.log($("#"+currentEntity.id));
    console.log("AND:");
    console.log($("#"+currentEntity.id)[0]);
    // update the entity object:
    currentEntity.x = x;
    currentEntity.y = y;
    currentEntity.z = z;
    
    currentEntity.changed = true;
}

// function to change the size of an entity:
function resizeEntity() {
    if (uploadInProgress || downloadInProgress)
        return;
    if (currentEntity) {
        // get the new width and height:
        var width = wInput.val();
        var height = hInput.val();
        
        //only make changes if the width/height was actully changed:
        if (width != currentEntity.width || height != currentEntity.height) {
            // change the entity:
            currentEntity.width = width;
            currentEntity.height = height;
            currentEntity.changed = true;
            // change the entity's element as appropriate:
            switch(currentEntity.type) {
                case "textbox" :
                    $("#"+currentEntity.id).children().css({
                        rows: height, cols: width});
            }
        }
    }
}


// function to change the type of an entity
function changeType() {
    if (uploadInProgress || downloadInProgress)
        return;
    // warn user that changing the type could discard content:
    if (window.confirm("Entity content may be discarded if type is changed. Continue?")) {
        // set the type for the entity
        currentEntity.type = typInput[0].value;
        // set the content as appropriate:
        switch(currentEntity.type) {
            case "image" :
                currentEntity.content = "";
                break;
            case "textbox" :
                currentEntity.content = "Enter text here. HTML may also be used for formatting";
                break;
            case "bulletlist" :
                currentEntity.content = "Enter text here. Each new line is an entry in the list";
            default : break;
        }
        //update the property div
        updatePropertyDiv();
    }
}


////////////////////////////////////////////
// Functions to handle UI elements        //
////////////////////////////////////////////

// Function that does exactly as it says on the tin:
function updatePropertyDiv() {
    if (currentEntity) { //if the current entity is defined
        // Set all the properties equal to those of the entity:
        xInput.val(currentEntity.x);
        yInput.val(currentEntity.y);
        zInput.val(currentEntity.z);
        // fill the content div with the appropriate elements based on the entity type:
        ContentInputDiv.hide("slow");
        ContentInputDiv.empty();
        switch(currentEntity.type) {
            case "image" : // create an image preview and a image loader if the entity is an image
                // set the type input first:
                typeInput[0].selectedIndex = 3;
                // create and add the components for the content div:
                var fileButton = $('<input type="file">');
                var image = $('<img>');
                image.hide(0);
                fileButton[0].onchange = function () {
                    var reader = new FileReader();
                    var file = $("input[type=file]")[0].files[0];
                    if (file) {
                        reader.onloadend = function() {
                            image[0].src = reader.result;
                            currentEntity.content = reader.result;
                            image[0].width = 50;
                            image[0].height = 50;
                            image[0].src = reader.result;
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
                if(currentEntity.type == "textbox")
                    typeInput[0].selectedIndex = 1;
                else
                    typeInput[0].selectedIndex = 2;
                var textContent = $('<textarea id="textContent"></textarea>');
                textContent[0].style.overflow = "auto";
                textContent[0].style.resize = "none";
                textContent[0].width = 400;
                textContent[0].height = 70;
                textContent[0].innerHTML = currentEntity.content;
                ContentInputDiv.append(textContent);
                textContent.onChange = updateEntityPreviewContent;
                break;
            default :
                Console.log("Bad Entity Type" + currentEntity.type);
                break;
        }
        ContentInputDiv.show("slow");
    // otherwise reset all values to default:
    } else {
        xInput.val(0);
        yInput.val(0);
        zInput.val(0);
        ContentInputDiv.hide("slow");
        ContentInputDiv.empty();
    }
}

// function to update the current entity's representation on the page preview
function updateEntityPreviewContent() {
    if (currentEntity) {
        //first get the element
        var element = $("#" + currentEntity.id);
        // create the element if it doesn't exist:
        if (!element[0]) {
            element = $('<div id="' + currentEntity.id +'"></div>');
            // add the element to the page div preview
            pagePreviewDiv.append(element);
            // set the css for the element
            element[0].top = currentEntity.y;
            element[0].left = currentEntity.x;
            element[0]["z-index"] = currentEntity.z;
            element[0].size = "auto";
            element[0].position = "absolute";
//            element.animate({position: "absolute",
//                left: currentEntity.x,
//                top: currentEntity.y,
//                "z-index": currentEntity.z,
//                size:  "auto"});
            
        }
        // add/update the appropriate contents
        switch(currentEntity.type) {
            case "image" :
                // get the element for the entity:
                var image = element.children("img");
                //empty the div and create a new image element if one doesn't exist"
                if(!image[0]) {
                    image = $("<img>");
                    element.empty();
                    elememt.append(image);
                }
                // set the image's width, height, and source:
                image.width = currentEntity.width;
                image.height = currentEntity.height;
                image.src = currentEntity.content;
                break;
            case "textbox" :
                //get the element for the entity:
                var box = element.children("textarea");
                //empty the div and create a new textarea if one doesn't exist:
                if (!box[0]) {
                    box = $('<textarea></textarea>');
                    box[0].wrap = true;
                    box[0].readOnly = true;
                    box[0].resize = "none";
                    element.empty();
                    element.append(box);
                }
                // set the content of the text area to that of the 
                box.val(currentEntity.content);
                box[0].rows = currentEntity.width;
                box[0].cols = currentEntity.height;
                break;
            case "bulletlist" :
                // get the element for the entitiy:
                var list = element.children("ul");
                // empty the div and create a new list if one does'nt exist:
                if(!list[0]) {
                    element.empty();
                    var list = $("<ul><ul>");
                    element.append(list);
                }
                // empty the list:
                list.empty();
                // slice the content along line breaks to get the list entries:
                var entries = currentEntity.content.split(/(\r\n|\n|\r)/gm);
                // add each entry to the list:
                for (var i = 0; i < entries.length; ++i)
                    var entry = $("<li>"+entries[i]+"</li>");
        }
    }
}


// function to update the entity list div
function updateEntitiesDiv() {
    //todo
    console.log("updateEntitesDiv() has not been implemented yet!");
}

// function to regenerate the page preview without recreating elements that already exist
function regenPagePreview() {
    //todo
    console.log("regenPagePreview() has not been implemented yet!");
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
           page.lectureID = "10";
           
           // Sends a new post request for the new page.
           var lecture = new Lecture();
           lecture.courseTitle = "Course";
           lecture.instructor = "Instructor";
           lecture.lectureTitle = "Lecture";
           lecture.id = "10";
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





























