// Global variables:
var currentLecture;
var currentSlide;
var currentEntity;
var entityList;

// Commonly Referenced Elements:
var slideDiv;
var entitiesDiv;
var entityContent;
var entityProperties;
var xInput;
var yInput;
var zInput;
var typeInput;
var contentInput;

// Initialize some of the global variables
window.onload = function() {
    entityContent = $("#entityContent");
    entityProperties = $("#entityProperties");
    xInput = $("#xInput");
    yInput = $("#yInput");
    zInput = $("#zInput");
    typeInput = $("#typeInput");
};

function moveEntity() {
    // get the x y and z values:
    var x = xInput.val;
    var y = yInput.val;
    var z = zInput.val;
    
    // update the entity's element:
    $("#"+currentEntity.id).css({top: x, left: y, "z-index": z});
    
    // update the entity object:
    currentEntity.x = x;
    currentEntity.y = y;
    currentEntity.z = z;
}


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
    
//    // ask server to add a new entity to the slide:
//    $.post("ShowAndTell",
//           {action: "newEntity",
//            lectureID: currentLecture.lectureID,
//            pageID: currentSlide.slideID,
//            }
    
    //});
       
    
}

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


function updatePropertyDiv() {
    if (currentEntity) { //if the current entity is defined
        // Set all the properties equal to those of the entity:
        xInput.val(currentEntity.x);
        yInput.val(currentEntity.y);
        zInput.val(currentEnttiy.z);
<<<<<<< Updated upstream
        //switch()
=======
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
                if(currentContext.type == "textbox")
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
    
>>>>>>> Stashed changes
    } else {
        xInput.val(0);
        yInput.val(0);
        zInput.val(0);
    }
}

$(document).ready(function() {
	// Animate the side div in.
	$("#sideDiv").hide().fadeIn();
	
	// Add hover functionality to each button.
	var buttons = $("button");
	for (var i = 0; i < buttons.length; i++) {
		// Add the hover class when the mouse enters the button.
		$(buttons[i]).mouseenter(function() {
			$(this).switchClass("", "hover", 200);
		});
		// Remove the hover class when the mouse leaves the button.
		$(buttons[i]).mouseleave(function() {
			$(this).switchClass("hover", "", 200);
		});
	}
});


function updateEntityElementContent() {
        if (currentEntity) {
        //first get the element
        var element = $("#" + currentEntity.id);
        // create the element if it doesn't exist:
        if (!element[0]) {
            element = $('<div id="' + currentEntity.id +'"></div>');
            element.css({position: "absolute",
                        left: currentEntity.x,
                        top: currentEntity.y,
                        "z-index": currentEntity.z,
                        size:  "auto"});
            // add the element to the SHIT FUCKING TITS
            slideDiv.add(element);
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
                
        }
    }
}


































