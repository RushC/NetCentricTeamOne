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
    if (currentEntity) {
        xInput.val(currentEntity.x);
        yInput.val(currentEntity.y);
        zInput.val(currentEnttiy.z);
        //switch()
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


































