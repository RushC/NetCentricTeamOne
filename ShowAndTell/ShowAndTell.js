// Global variables:
var currentLecture;
var currentSlide;
var currentEntity;
var entityList;

// Commonly Referenced Elements:
var slideDiv;
var entitiesDiv;

function moveEntity() {
    // get the x y and z values:
    var x = document.getElementById("xLoc").value;
    var y = document.getElementById("yloc").value;
    var z = document.getElementById("zLoc").value;
    
    // update the entity's element:
    $("#"+currentEntity.id).css({top: x, left: y, "z-index": z});
    
    // update the entity object:
    currentEntity.x = x;
    currentEntity.y = y;
    currentEntity.z = z;
}


