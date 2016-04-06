$(document).ready(function () {
    // Add hover functionality to each button.
    var buttons = $("a");
    for (var i = 0; i < buttons.length; i++) {
        // Add the hover class when the mouse enters the button.
        $(buttons[i]).mouseenter(function () {
            $(this).switchClass("", "hover", 200);
        });
        // Remove the hover class when the mouse leaves the button.
        $(buttons[i]).mouseleave(function () {
            $(this).switchClass("hover", "", 200);
        });
    }
    
    buttons = $("input");
    for (var i = 0; i < buttons.length; i++) {
        // Add the hover class when the mouse enters the button.
        $(buttons[i]).mouseenter(function () {
            $(this).switchClass("", "hover", 200);
        });
        // Remove the hover class when the mouse leaves the button.
        $(buttons[i]).mouseleave(function () {
            $(this).switchClass("hover", "", 200);
        });
    }
});
