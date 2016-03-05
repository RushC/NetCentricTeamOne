function Flag(image, yOffset, maxWidth, maxHeight, startRotation, rotationAmount, scaleFactor) {
    this.image = image;
    this.rotation = startRotation % 360 || 0;
    this.maxWidth = maxWidth || image.width;
    this.maxHeight = maxHeight || image.height;
    this.scaleFactor = scaleFactor || 0.5;
    this.rotationAmount = rotationAmount || 2
    this.yOffset = yOffset;
    // Create the canvas to draw the flag on.
    this.canvas = document.createElement('canvas');
    this.canvas.width = image.width;
    this.canvas.height = image.height;
    this.y = 0;
    
    this.draw = function(drawingContext) {
        var context = this.canvas.getContext('2d');
        
        // Clear the canvas.
        context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        
        // Flip the flag based on the angle.
        var angle = (this.rotation * this.rotationAmount) % 360;
        var flipw = this.image.width * Math.cos(angle * Math.PI / 180);
        var flipx = this.image.width / 2 - flipw / 2;
        if (angle >= 90 && angle < 270) {
            context.resetTransform();
            context.translate(this.image.width, 0);
            context.scale(-1, 1);
        }
        else
            context.resetTransform();
        
        // Calculate new dimensions for the canvas based on the rotation.
        var scale = 1 - (Math.cos((this.rotation - 180) * Math.PI / 180) * (1 - this.scaleFactor) / 2 + (1 - this.scaleFactor) / 2);
        var w = flipw * scale;
        var h = this.image.height * scale;
        var x = flipx - (w - flipw) / 2;
        var y = -(this.image.height - this.canvas.height) / 2;
        
        // Draw the image to the flag's canvas.
        context.drawImage(this.image, x, y, w, h);
        
        // Make the flag darker as it gets further back.
        context.fillStyle = "rgba(0, 0, 0, " + (-scale + 1) + ")";
        context.fillRect(x, y, w, h)
        
        // Calculate the location where the flag should be drawn.
        x = Math.sin(this.rotation * Math.PI / 180) * this.maxWidth / 2 + this.maxWidth / 2;
        this.y = this.yOffset + Math.cos(this.rotation * Math.PI / 180) * this.maxHeight / 2 + this.maxHeight / 2;
        
        // Draw the the flag's canvas to the drawing context.
        drawingContext.drawImage(this.canvas, x, this.y);
    }
}

var imgs = [];
var flags = [];
var flagNames = [ "usa", "uk", "china", "japan", "france", "italy", "germany", "canada", "korea", "africa", "brazil" ];
var readyImgs = flagNames.length;

addEventListener("load", function() {    
    for (var i = 0; i < flagNames.length; ++i) {
        imgs[i] = new Image();
        imgs[i].src = "/CanvasAnimation/" + flagNames[i] + "_flag.png";
        imgs[i].onload = function() {
            if (--readyImgs == 0)
                makeFlags();
        }
    }
});

function makeFlags() {
    var flagsPerRow = 12;
    var rows = 4;
    for (var i = 0; i < flagsPerRow; ++i) {
            for (var j = 0; j < rows; ++j)
                flags.push(new Flag(imgs[Math.round(Math.random() * (imgs.length - 1))], j*(document.getElementById("flag").height / rows), 800, 75, i * (360/flagsPerRow), Math.floor(Math.random()*10)));
        }
    requestAnimationFrame(drawFlags);
}
function drawFlags() {
    // Clear the canvas holding the animation.
    var canvas = document.getElementById("flag");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all of the flags to the canvas.
    for (var i = 0; i < flags.length; i++) {
        flags[i].draw(canvas.getContext('2d'));
        flags[i].rotation = (flags[i].rotation + 1) % 360;
    }
    flags.sort(function(a, b) { return (a.y - a.yOffset) - (b.y - b.yOffset)});
    // Request another animation frame to continue the animation.
    requestAnimationFrame(drawFlags);
}