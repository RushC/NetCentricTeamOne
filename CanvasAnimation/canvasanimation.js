/**
 * Constructor for a Flag object.
 *
 * @param image - the fully loaded image to draw
 * @param yOffset - the distance from the top to draw the flag
 *                  (not accounting for any transformations based on rotation).
 * @param maxWidth - the width of the ellipse that represents the flag's path.
 * @param maxHeight - the height of the ellipse that represents the flag's path.
 * @param startRotation - the starting location of the flag on its path in degrees.
 *                        0 degrees places the flag at the bottom of the ellipse.
 * @param rotationAmount - how many times the flag should rotate in one cycle arounf
 *                         the ellipse.
 * @param scaleFactor - the amount the flag should be scaled when the flag is at the
 *                      top of its ellipse. This is used to give the flag a sense of
 *                      depth as it travels to the "background". A factor of 1.0 means
 *                      the flag will never change size.
 */
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
    
    /**
     * Draws the flag to the specified drawing context.
     *
     * @param drawingContext - the drawing context on which the flag should be drawn.
     *                         This context will not be transformed in any way.
     */
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

// All of the images that can be used.
var imgs = [];
var flags = [];
// The list of flag image resources.
var flagNames = [ "usa", "uk", "china", "japan", "france", "italy", "germany", "canada", "korea", "africa", "brazil" ];
// A counter used to know when all of the flags are loaded.
var readyImgs = flagNames.length;
// The ID for the animation's callback request.
var request;

addEventListener("load", function() {
    // Set the size of the main canvas.
    document.getElementById("flag").width = document.body.clientWidth;
    document.getElementById("flag").height = document.body.clientWidth;
    
    // Load all of the flag image resources.
    for (var i = 0; i < flagNames.length; ++i) {
        // Load the image.
        imgs[i] = new Image();
        imgs[i].src = "/CanvasAnimation/" + flagNames[i] + "_flag.png";
        
        // Listen for when the image is loaded.
        imgs[i].onload = function() {
            // If the loaded image was the last one...
            if (--readyImgs == 0) {
                // Create all of the flags.
                makeFlags(4, 12, 0.5, 5, 1);
                // Load the side panel.
                parent.document.getElementById("sframe").contentDocument.location = "/CanvasAnimation/side.html";
            }
        }
    }
});

// Creates all of the flag objects based on the given settings.
function makeFlags(rows, flagsPerRow, degrees, maxSpinRate, minSpinRate) {
    console.log(rows);
    console.log(flagsPerRow);
    console.log(degrees);
    // Cancel any requests for an animation frame callback.
    if (request)
        cancelAnimationFrame(request);
            
    // Define the degrees increment.
    this.degrees = degrees;
    
    // Clear any flags that may already exist.
    flags = [];
        
    // Loop through each of the rows and create each of the flags.
    for (var i = 0; i < flagsPerRow; ++i)
            for (var j = 0; j < rows; ++j)
                flags.push(new Flag(
                    // Choose a random image.
                    imgs[Math.round(Math.random() * (imgs.length - 1))], 
                    // Calculate the y offset.
                    j*(document.getElementById("flag").height / rows), 
                    // Scale the width of the path based on the width of the main canvas.
                    document.getElementById("flag").width - 300,
                    // Let the user choose the height of the path.
                    75,
                    // Space out all of the flags in each row equally.
                    i * (360/flagsPerRow), 
                    // Randomly determine how fast each flag spins.
                    minSpinRate + Math.floor(Math.random()*(maxSpinRate - minSpinRate))
                ));
    
    // Request the first animation frame.
    request = requestAnimationFrame(drawFlags);
}

// Draws each of the flags on the main canvas.
function drawFlags() {
    // Clear the canvas holding the animation.
    var canvas = document.getElementById("flag");
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw all of the flags to the canvas.
    for (var i = 0; i < flags.length; i++) {
        flags[i].draw(canvas.getContext('2d'));
        
        // Increment the flags' rotations for the next frame.
        flags[i].rotation = (flags[i].rotation + degrees) % 360;
    }
        
    // Sort the flags based on their perceived closeness to the front.
    // This allows the flags that are in the front to be drawn over top
    // of the flags in the back in the next frame of animation.
    flags.sort(function(a, b) { return (a.y - a.yOffset) - (b.y - b.yOffset)});
    
    // Request another animation frame to continue the animation.
    request = requestAnimationFrame(drawFlags);
}