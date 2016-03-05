function Flag(image, maxWidth, maxHeight, startRotation) {
    this.image = image;
    this.rotation = startRotation % 360 || 0;
    this.maxWidth = maxWidth || image.width;
    this.maxHeight = maxHeight || image.height;
    
    // Create the canvas to draw the flag on.
    this.canvas = document.createElement('canvas');
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    
    this.draw = function(drawingContext) {
        var context = this.canvas.getContext('2d');
        
        // Clear the canvas.
        context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        // Flip the flag based on the angle.
        var angle = (this.rotation * 5) % 360;
        var flipw = this.image.width * Math.cos(angle * Math.PI / 180);
        var flipx = this.image.width / 2 - flipw / 2;
        if (angle == 90) {
            context.translate(this.image.width, 0);
            context.scale(-1, 1);
        }
        else if (angle == 270)
            context.resetTransform();
        
        // Calculate the location where the flag should be drawn.
        var x = Math.sin(this.rotation * Math.PI / 180) * this.maxWidth;
        var y = Math.cos(this.rotation * Math.PI / 180) * this.maxHeight / 2 + this.maxHeight / 2;
        
        //draw the image to the flag's canvas.
        context.drawImage(this.image, flipx, 0, flipw, image.height);
        
        // Draw the the flag's canvas to the drawing context.
        drawingContext.drawImage(this.canvas, x, y);
    }
}

var flag;

addEventListener("load", function() {
    var img = new Image();
    img.onload = function() {
        flag = new Flag(img);
        requestAnimationFrame(drawFlag);
    }
    img.src = "/CanvasAnimation/usa_flag.png";  
});

function drawFlag() {
    var canvas = document.getElementById("flag");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    flag.draw(canvas.getContext('2d'));
    flag.rotation = (flag.rotation + 1) % 360;
    requestAnimationFrame(drawFlag);
}

function refresh() {
    var w = width * Math.cos(angle * Math.PI / 180);
    var x = width / 2 - w / 2;
    context.clearRect(x, 0, w, image.height);
    angle = (angle + 1) % 360;
    if (angle == 90) {
        context.translate(width, 0)
        context.scale(-1, 1);
    }
    else if (angle == 270) {
        context.resetTransform();
    }
    w = width * Math.cos(angle * Math.PI / 180);
    x = width / 2 - w / 2;
    context.drawImage(image, x, 0, w, image.height);
    requestAnimationFrame(refresh);
}