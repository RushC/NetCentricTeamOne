function Flag(x, y, width, height, image, startRotation) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.rotation = startRotation % 360;
}

function drawFlag(context, flag) {
    //change the values as appropriate here:
    
    //draw the image:
    context.drawImage(flag.image, flag.x, flag.y, flag.width, flag.height);
}

addEventListener("load", function() {
    
    
});