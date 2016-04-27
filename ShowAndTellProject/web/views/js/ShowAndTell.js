////////////////////////////////////////////
// General Global variables               //
////////////////////////////////////////////
var currentLecture;             // current lecture being edited
var currentSlide;               // current slide being edited
var currentEntity;              // current entity being edited
var entityList = [];            // list of entities for the current slide
var slideList = [];             // list of slides for this lecture
var uploadInProgress = false;   // true when uploading to the server
var downloadInProgress = false; // true when getting content from the server
var idPlaceHolder = "fakeID";   // used with fakeIDCount to generate ids for preview elements of new entities or slides
var fakeIDCount = 0;            // used to identify entities or slides without unique ids assigned by the server
var slideOverride = false;      // determines if moving a slide to a sequence should delete the slide already in that sequence

////////////////////////////////////////////
// Commonly Referenced Elements           //
////////////////////////////////////////////
var slidePreviewDiv;            // div containing the slide preview
var entitiesDiv;                // div containing a list of entities on the current slide
var ContentInputDiv;            // div containing the content input for an entity
var entityProperties;           // div containing the editable properties of the currently selected entity
var xInput;                     // input for the currently selected entity's horizontal position on the slide
var yInput;                     // input for the currently selected entity's vertical position on the slide
var zInput;                     // input for the currently selected entity's z-index based draw order
var hInput;                     // input for the currently selected entity's height
var wInput;                     // input for the currently selected entity's width
var typeInput;                  // input for the currentyl selected entity's type

///////////////////////////////////////////////////////////
// constructors for creating new lecture/slide/entities  //
///////////////////////////////////////////////////////////
function Entity(me) {
    this.lectureID = me ? me.lectureID : currentLecture.id;
    this.slideID = me ? me.PageID : currentSlide.id;
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

function Slide(ms) {
    this.id = ms ? ms.pageID : idPlaceHolder + fakeIDCount++;
    this.lectureID = ms ? ms.lectureID : currentLecture.id;
    this.seq = ms ? ms.pageSequence : "1";//slideCount;
    this.audio = ms ? ms.pageAudioURL : "";
    this.status = ms ? "unchanged" : "added";
}

////////////////////////////////////////////////////////////////////////////////////////////
// Constructors for objects that will translate into their java bean equivalents          //
//(need this because the json representation has to be exactly the same as the java class //
//- will not work if there are extra fields such as status)                               //
////////////////////////////////////////////////////////////////////////////////////////////
function ModelEntity(e) {
    this.lectureID = e.lectureID;
    this.pageID = e.slideID;
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

function ModelSlide(s) {
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
    slidePreviewDiv = $("#slidePreviewDiv");
    entitiesDiv = $("#entitiesDiv");
    ContentInputDiv = $("#entityContent");
    entityProperties = $("#entityProperties");
    xInput = $("#xInput");
    yInput = $("#yInput");
    zInput = $("#zInput");
    hInput = $("#hInput");
    wInput = $("#wInput");
    typeInput = $("#typeInput");
    // check to make sure the element variables are non null
    var badElements = {
        "Missing Element slidePreviewDiv" : slidePreviewDiv,
        "Missing Element entitiesDiv" : entitiesDiv,
        "Missing Element ContentInputDiv" : ContentInputDiv,
        "Missing Element entityProperties" : entityProperties,
        "Missing Element xInput" : xInput,
        "Missing Element yInput" : yInput,
        "Missing Element zInput" : zInput,
        "Missing Element hInput" : hInput,
        "Missing Element wInput" : wInput,
        "Missing Element typeInput" : typeInput
    };
    for (var e in badElements) {
        if (!badElements[e][0])
            console.log(e + "!");
    }
    
    // set the current entity, current slide, and current lecture for testing purposes:
    currentLecture = new Lecture();
    currentLecture.id = "fakeLectureID";
    currentSlide = new Slide();
    currentEntity = new Entity();
    
    updatePropertyDiv();
    updateEntityPreviewContent();
};


////////////////////////////////////////////
// Functions to communicate with server   //
////////////////////////////////////////////
// function to save the current slide to the server:
function saveToServer() {
    //indicate that a save is in progress
    uploadInProgress = true;
    // define the action for the post
    if (currentSlide.status == "added")
        action = "newPage";
    else if (currentSlide.status == "deleted")
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
    
    // create lists of newly added, changed, and deleted slides
    var addedSlides = [];
    var changedSlides = [];
    var deletedSlides = [];
    for (var i = 0; i < slideList.length; ++i) {
        if (slideList[i].status == "added")
            addedSlides.push(slideList[i]);
        else if (slideList[i].status == "deleted")
            deletedSlides.push(slideList[i]);
        else if (slideList[i].changed)
            changedSlides.push(slideList[i]);
    }
        
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas(slidePreviewDiv, {
       onrendered: function(canvas) {
           console.log("Snapshot successful");
           
           // Set the slide's image property to the data url from the canvas.
           currentSlide.audio = canvas.toDataURL();
           
           // create and send the message
            $.post("/ShowAndTell/Controller", {
                "action" : "updateLecture",
                "lecture" : JSON.stringify(new ModelLecture(currentLecture)),
                "newEntities" : JSON.stringify(addedEntities),
                "changedEntities" : JSON.stringify(changedEntities),
                "deletedEntities" : JSON.stringify(deletedEntities),
                "newPages" : JSON.stringify(addedSlides),
                "updatedPages" : JSON.stringify(changedSlides),
                "deletedPages" : JSON.stringify(deletedSlides)}, processSaveResponse);
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
    //todo
    console.log("getEntities() has not yet been implemented");
}

function processSaveResponse(response) {
    var resp = JSON.parse(response);
    
    // reset the slideList
    slideList = [];
    for (var i; i < resp.pages.length; ++i) {
           slideList.push(new slide(resp.pages[i]));
    } 
    // get the first slide in sequence if the current slide was deleted
    if (currentSlide.status == "deleted") {
        var low = slideList[i];
        for (var i = 0; i < slideList.length; ++i)
            if (slideList[i].seq < low.seq)
                low = slideList[i];
        currentSlide = low;
    }
    // get an updated list of the entities for this slide:
    getEntities();
    // update ui elements
    regenSlidePreview();
    updateEntitiesDiv();
    updatePropertyDiv();
    // done uploading
    uploadInProgress = false;
}

function processGetPagesResponse(response) {
    //todo
    console.log("processGetPagesResponse() has not been implemented yet");
}

function processGetEntitiesResponse(response) {
    //todo
    console.log("processGetEntitiesResponse() has not been implemented yet");
}

////////////////////////////////////////////
// Functions to modify slides             //
////////////////////////////////////////////

// function to change the sequence of a slide to the given sequence
function setSlideSeq() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the new sequence
    var seq = $("#sequenceInput").val();
    // find the slide in the list at the sequece (if one exists)
    var swapSlide = false;
    for (var i = 0; i < slideList.length; ++i)
        if (slideList[i].seq == seq)
            swapSlide = slideList[i];
    // swap the old slide if it exists
    if (swapSlide) {
        swapSlide.seq = currentSlide.seq;
        swapSlide.changed = true;
    }
    // set the new seq for the current slide
    currentSlide.seq = seq;
    currentSlide.changed;
}

// function to change the audio URL of a slide
function setSlideAudioURL() {
    if (uploadInProgress || downloadInProgress)
        return;
    // get the new audio url
    var aurl = $("#audioURLInput").val();
    // set the url
    currentSlide.audio = aurl;
    currentSlide.changed = true;
}

// function to delete a slide
function deleteSlide() {
    if (uploadInProgress || downloadInProgress)
        return;
    // ask the user if they are sure
    if (window.confirm("Deleting this slide will also delete all entities on it and cause any pending changes to be saved to the server. Continue?")) {
        // set the slide as deleted:
        currentSlide.status = "deleted";
        // set the entities of this page to deleted:
        for (var i = 0; i < entityList.length; ++i) {
            if (entityList[i].status != "added") // if the entity isn't new, delete it
                entityList[i].status = "deleted";
            else { // otherwise set the entity to unchanged so it is ignored by the update
                entityList[i].status = "unchanged";
                entityList[i].changed = false;
            }
        }
        // save the current state and request another slide to view:
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
    entityProperties.show();
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

// function to update the current entity's representation on the slide preview
function updateEntityPreviewContent() {
    if (currentEntity) {
        //first get the element
        var element = $("#" + currentEntity.id);
        // create the element if it doesn't exist:
        if (!element[0]) {
            element = $('<div id="' + currentEntity.id +'"></div>');
            // add the element to the slide div preview
            slidePreviewDiv.append(element);
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

// function to regenerate the slide preview without recreating elements that already exist
function regenSlidePreview() {
    //todo
    console.log("regenSlidePreview() has not been implemented yet!");
}

/**
 * Constructs a snapshot of the slide preview div and sets its image content to a
 * data URL for an image of the screenshot.
 *
 * @param {slide} the Slide object currently diplayed in the slide preview div.
 */
function pageSnapshot(slide) {
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas(slidePreviewDiv, {
       onrendered: function(canvas) {
           console.log("Snapshot successful");
           
           // Set the slide's image property to the data url from the canvas.
           slide.audio = canvas.toDataURL();
           slide.lectureID = "10";
           
           // Sends a new post request for the new slide.
           var lecture = new Lecture();
           lecture.courseTitle = "Course";
           lecture.instructor = "Instructor";
           lecture.lectureTitle = "Lecture";
           lecture.id = "10";
           var newPages = [ new ModelSlide(slide) ];
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





























