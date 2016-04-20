////////////////////////////////////////////
// General Global variables:
////////////////////////////////////////////
var currentLecture;
var currentSlide;
var currentEntity;
var entityList;
var slideCount;
var awaitingResponse = false;

////////////////////////////////////////////
// Commonly Referenced Elements:
////////////////////////////////////////////
var slideDiv;
var entitiesDiv;
var entityContent;
var entityProperties;
var xInput;
var yInput;
var zInput;
var hInput;
var wInput;
var typeInput;
var contentInput;

////////////////////////////////////////////
// constructors for creating new lecture/slide/entities:
////////////////////////////////////////////
function Entity(me) {
        this.lectureID = me.lectureID || currentLecture.id;
        this.slideID = me.PageID || currentSlide.id;
        this.type = me.entityType || "textbox";
        this.id = me.entityID || "";
        this.x = me.entityX || 0;
        this.y = me.entityY || 0;
        this.z = me.entityZ || 0;
        this.anim = me.entityAnimation || "none";
        this.height = me.entityHeight || 0;
        this.width = me.entityWidth   || 0;
        this.content = me.entityContent || "";
        this.status = me ? "unchanged" : "added";
        this.changed = me ?;
    }
}

function Lecture(ml) {
    this.id = ml.lectureID || "";
    this.lectureTitle = ml.lectureTitle || "Lecture Title";
    this.courseTitle = ml.courseTitle || "Course Title";
    this.instructor = ml.instructor || "Instructor Name";
    this.status = ml ? "unchanged" : "added";
}

function Slide(ms) {
    this.id = ms.pageID || "";
    this.lectureID = ms.lectureID || currentLecture.id;
    this.seq = ms.pageSequence || slideCount;
    this.audio = ms.pageAudioURL || "";
    this.status = ms ? "unchanged" : "added";
    this.changed = ms ?;
}

////////////////////////////////////////////
// constructors for objects that will translate into their java bean equivalents (need this because the json representation has to be exactly the same as the java class - will not work if there are extra fields such as status)
////////////////////////////////////////////
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
// Script Initialization
////////////////////////////////////////////
window.onload = function() {
    slideDiv = $("#slideDiv");
    entitiesDiv = $("#entitiesDiv");
    entityContent = $("#entityContent");
    entityProperties = $("#entityProperties");
    xInput = $("#xInput");
    yInput = $("#yInput");
    zInput = $("#zInput");
    hInput = $("#hInput");
    wInput = $("#wInput");
    typeInput = $("#typeInput");
    currentEntity = {
        type: "textbox",
        width: "10",
        height: "10",
        content: "TEST",
        id: "SOMETHING",
        x: 4,
        y: 4
    };
    updatePropertyDiv();
    updateEntityElementContent();
};


////////////////////////////////////////////
// Functions to communicate with server
////////////////////////////////////////////
// function to save the current slide to the server:
function() saveToServer() {
    //create a list of newly added entities:
    
    
}

function processSaveResponse(resp) {
}


////////////////////////////////////////////
// Functions to modify entities
////////////////////////////////////////////

// function to create a new entity:
function newEntity() {
    // Reset the properties values:
    xInput.val = 0;
    yInput.val = 0;
    zInput.val = 0;
    typeInput[0].selectedIndex = 0;
    entityContent.empty();
    // make sure the properties div is showing
    entityProperties.show();
    // create a new entitiy:
    currentEntity = new Entity();
    // add the entity to the list:
    entityList.push(currentEntity);
    
    
}

// function to move an entity:
function moveEntity() {
    // get the x y and z values:
    var x = xInput.val;
    var y = yInput.val;
    var z = zInput.val;
    
    // update the entity's element:
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
    // warn user that changing the type could discard content:
    if (window.confirm("Entity content may be discarded if type is changed. Continue?")) {
        // if changing to an image
        if(typeInput[0].value == "image") {
            // hide the content div:
            entityContent.hide();
            // clear the content div:
            entityContent.empty();
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
            entityContent.append(fileButton);
            entityContent.append(image);
            entityContent.show();
            
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
        entityContent.empty();
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
                entityContent.append(fileButton);
                entityContent.append(image);
                entityContent.show();
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
                entityContent.append(textContent);
                textContent.onChange = updateEntityElementContent;
                break;
            default :
                Console.log("Bad Entity Type" + currentEntity.type);
                break;
        }
        updateEntityElementContent();
    // otherwise reset all values to default:
    } else {
        xInput.val(0);
        yInput.val(0);
        zInput.val(0);
    }
}

// function to do exactly what its name implies
function updateEntityElementContent() {
        if (currentEntity) {
        //first get the element
        var element = $("#" + currentEntity.id);
        // create the element if it doesn't exist:
        if (!element[0]) {
            console.log("TEST MOTHERFUCKER")
            element = $('<div id="' + currentEntity.id +'"></div>');
            element.animate({position: "absolute"});
//                        left: currentEntity.x,
//                        top: currentEntity.y,
//                        "z-index": currentEntity.z,
//                        size:  "auto"});
            console.log(element);
            // add the element to the SHIT FUCKING TITS
            slideDiv.append(element);
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
                for (var i = 0; i < entries.length; ++i) {
                    var entry = $("<li>"+entries[i]+"</li>");
                }
        }
    }
}





























