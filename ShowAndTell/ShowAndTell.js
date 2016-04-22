////////////////////////////////////////////
// General Global variables               //
////////////////////////////////////////////
var currentLecture;             // current lecture being edited
var currentSlide;               // current slide being edited
var currentEntity;              // current entity being edited
var entityList;                 // list of entities for the current slide
var slideList;                  // list of slides for this lecture
var awaitingResponse = false;   // true when waiting for the server to respond to an upload
var idPlaceHolder = "fakeID";   // used with fakeIDCount to generate ids for preview elements of new entities or slides
var fakeIDCount = 0;            // used to identify entities or slides without unique ids assigned by the server

////////////////////////////////////////////
// Commonly Referenced Elements           //
////////////////////////////////////////////
var slidePreviewDiv;               // div containing the slide preview
var entitiesDiv;            // div containing a list of entities on the current slide
var ContentInputDiv;        // div containing the content input for an entity
var entityProperties;       // div containing the editable properties of the currently selected entity
var xInput;                 // input for the currently selected entity's horizontal position on the slide
var yInput;                 // input for the currently selected entity's vertical position on the slide
var zInput;                 // input for the currently selected entity's z-index based draw order
var hInput;                 // input for the currently selected entity's height
var wInput;                 // input for the currently selected entity's width
var typeInput;              // input for the currentyl selected entity's type

///////////////////////////////////////////////////////////
// constructors for creating new lecture/slide/entities  //
///////////////////////////////////////////////////////////
function Entity(me) {
        this.lectureID = me.lectureID || currentLecture.id;
        this.slideID = me.PageID || currentSlide.id;
        this.type = me.entityType || "textbox";
        this.id = me.entityID || idPlaceHolder + fakeIDCount++;
        this.x = me.entityX || 0;
        this.y = me.entityY || 0;
        this.z = me.entityZ || 0;
        this.anim = me.entityAnimation || "none";
        this.height = me.entityHeight || 0;
        this.width = me.entityWidth   || 0;
        this.content = me.entityContent || "";
        this.status = me ? "unchanged" : "added";
        this.changed = me ? false : true;
}

function Lecture(ml) {
    this.id = ml.lectureID || "";
    this.lectureTitle = ml.lectureTitle || "Lecture Title";
    this.courseTitle = ml.courseTitle || "Course Title";
    this.instructor = ml.instructor || "Instructor Name";
    this.status = ml ? "unchanged" : "added";
}

function Slide(ms) {
    this.id = ms.pageID || idPlaceHolder + fakeIDCount++;
    this.lectureID = ms.lectureID || currentLecture.id;
    this.seq = ms.pageSequence || slideCount;
    this.audio = ms.pageAudioURL || "";
    this.status = ms ? "unchanged" : "added";
    this.changed = ms ? false : true;
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

function modelSlide(s) {
    this.lectureID = s.lectureID;
    this.pageID = s.pageID;
    this.pageSequence = s.seq;
    this.pageAudioURL = s.aduio;
}

function ModelLecture(l) {
    this.lectureID = l.ID;
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
    }
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
    // create a list of newly added entities and a list of changed entities:
    var added = [];
    var changed = [];
    for (var i = 0; i < entityList.length; ++i) {
        if (entityList[i].status == "added")
            added.push(new ModelEntity(entityList[i]));
        else if (entityList[i].changed)
            changed.push(new ModelEntity(entityList[i]));
    }
    // indicated if the slide was modified, created, or left unchanged
    var slideState = currentSlide.status;
    if (currentSlide.changed && !currentSlide.status == "added")
        slideState = "changed";
    
    // create and send the message
    $.post("/ShowAndTell/Controller", {
        "pageStatus" : slideState,
        "workingPage" : new ModelSlide(currentSlide),
        "newEntities" : added,
        "changedEntities" : changed}, processSaveResponse);
    // indicate that we are waiting for the response
    awaitingResponse = true;
}

function processSaveResponse(resp) {
    // make sure the save was successful
    if (resp.saveResponse != "success") {
        alert("Could not upload changes to server");
        awaitingResponse = false;
        return;
    }
    
    // reset the entityList, currentSlide, and currentEntity
    currentSlide = new slide(resp.pageResponse);
    entityList = [];
    for (var i = 0; i < resp.entityResonse.length; ++i)
        entityList.push(new Entity(resp.entityResponse[i]));
    currentEntity = entityList[0];
    
    // update ui elements
    regenSlidePreview();
    updateEntitiesDiv();
    updatePropertyDiv();
    
}


////////////////////////////////////////////
// Functions to modify entities
////////////////////////////////////////////

// function to create a new entity:
function newEntity() {
    if (awaitingResponse)
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
    if (awaitingResponse)
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
    if (awaitingResponse)
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
    if (awaitingResponse)
        return;
    // warn user that changing the type could discard content:
    if (window.confirm("Entity content may be discarded if type is changed. Continue?")) {
        // if changing to an image
        if(typeInput[0].value == "image") {
            // hide the content div:
            ContentInputDiv.hide("slow");
            // clear the content div:
            ContentInputDiv.empty();
            // add a button to upload a file:
//            var loadButton = $("<button>Upload Image");
//            loadButton[0].onclick = function() {
//                
//            }
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
                        image[0].width = 25;
                        image[0].height = 25;
                        image[0].src = reader.result;
                    };
                    
                    reader.readAsDataURL(file);
                }
            };
            ContentInputDiv.append(fileButton);
            ContentInputDiv.append(image);
            ContentInputDiv.show("slow");
            
        }
    }
}


////////////////////////////////////////////
// Functions to handle UI elements
////////////////////////////////////////////

// Function that does exactly as it says on the tin:
function updatePropertyDiv() {
    if (currentEntity) { //if the current entity is defined
        // Set all the properties equal to those of the entity:
        xInput.val(currentEntity.x);
        yInput.val(currentEntity.y);
        zInput.val(currentEntity.z);
        // fill the content div with the appropriate elements based on the entity type:
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
                            image[0].width = 25;
                            image[0].height = 25;
                            image[0].src = reader.result;
                        };

                        reader.readAsDataURL(file);
                    }
                };
                ContentInputDiv.append(fileButton);
                ContentInputDiv.append(image);
                ContentInputDiv.show();
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
                textContent[0].width = currentEntity.width;
                textContent[0].height = currentEntity.height;
                textContent[0].innerHTML = currentEntity.content;
                ContentInputDiv.append(textContent);
                textContent.onChange = updateEntityPreviewContent;
                break;
            default :
                Console.log("Bad Entity Type" + currentEntity.type);
                break;
        }
        updateEntityPreviewContent();
    // otherwise reset all values to default:
    } else {
        xInput.val(0);
        yInput.val(0);
        zInput.val(0);
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





























