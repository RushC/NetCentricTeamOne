/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(document).ready(function () {
    // Animate the side div in.
    $("#sideDiv").hide().fadeIn();

    // Add hover functionality to each button.
    var buttons = $("button");
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

/*
function something() {
    parent.document.getElementById("cframe").contentWindow.location = "ShowAndTell/side.jsp"
}

function createSlide() {
    parent.document.getElementById("cframe").contentWindow.location = "ShowAndTell/side.jsp"
}
function editSlide() {
    parent.document.getElementById("cframe").contentWindow.location = "ShowAndTell/side.jsp"
}
function deleteSlide() {
    parent.document.getElementById("cframe").contentWindow.location = "ShowAndTell/views/side.jsp"
}
*/
