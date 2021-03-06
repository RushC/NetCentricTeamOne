/**
 * This script can be used for defining styles and animations for different
 * classes or types of elements.
 * 
 * This script generally adds little to no actual styling to elements, merely
 * classes and event listeners to allow for the stylsheets to define styles for
 * the new states each element can have.
 * 
 * Classes:
 * 
 *      .highlight  -   Adds the .hover class to element when it is hovered over.
 *      
 *      .dropdown   -   Turns a div containing an h3 tag and multiple ul items
 *                      into a makeshift select element. The h3 element will be
 *                      used as the main displaying element and will be given
 *                      the class .dropdownHeader. The ul items will be used as
 *                      the options and will each be given the class
 *                      .dropdownOption and will be stored in a div with the
 *                      class .dropdownList. To get the selected value at any
 *                      time, retrieve the value attribute from the h3 element.
 *                      Wheneve the dropdown list is opened, the h3 element
 *                      and the list div will gain the class .dropdownOpen. When
 *                      a dropdownOption is clicked, the dropdownHeader's value
 *                      and innerHTML will be set to that of clicked option and
 *                      the dropdown element's onchange handler will be called.
 *                      
 *      .select     -   Adds the .selected class to element when it is clicked
 *                      and removes it whenever another .select element is
 *                      clicked.
 */

addEventListener("load", function() {
    console.log("Adding effects");
    // Add effects for all of the already signified classes.
    $('.dropdown').each(function(i, element) { dropdown(element); });
    $('.highlight').each(function(i, element) { highlight(element); });
    $('.select').each(function(i, element) { select(element); });
});
    

/**
 * Adds the functionality of the dropdown class to the specified element.
 * 
 * @param {HTMLElement} element the element to add dropdown functionality to.
 */
function dropdown(element) {
    // Create a dropdownList div and add it to the element.
    var listDiv = document.createElement('div');
    listDiv.classList.add('dropdownList');
    element.appendChild(listDiv);
    listDiv.style.position = "absolute";
    listDiv.style.zIndex = "999";

    // Retrieve each ul element in the div.
    var $dropdownOption = $("ul", element);

    // Add the dropdownOption class to each ul.
    $dropdownOption.addClass('dropdownOption');

    // Iterate through each ul element in the div.
    $('ul', element).each(function(ulIndex, ulElement) {            
        // Remove the element from the div and add it to the list div.
        element.removeChild(ulElement);
        listDiv.appendChild(ulElement);

        // Add a click listener for each option.
        $(ulElement).click(function() {
            // Retrieve the header.
            var dropdownHeader = $(".dropdownHeader", this.parentElement.parentElement)[0];

            // Set the value and text of the header.
            dropdownHeader.innerHTML = this.innerHTML + " \u25BC";
            dropdownHeader.value = this.value;

            // Slide the dropdown list up.
            var $dropdownList = $(this.parentElement);
            $dropdownList.slideUp(200);

            // Remove the dropdownOpen class from the dropdown list and header.
            $(dropdownHeader).removeClass("dropdownOpen", 200);
            $dropdownList.removeClass("dropdownOpen", 200);

            // Trigger a change event on the dropdown.
            $(dropdownHeader.parentElement).trigger("change");
        });
    });

    // Hide the list div immediately.
    $(listDiv).hide();

    // Retrieve the h3 element for the class.
    var $dropdownHeader = $("h3", element);

    // Add an arrow character to the header's text.
    $dropdownHeader[0].innerHTML += " \u25BC";

    // Give each h3 element the dropdownHeader class.
    $dropdownHeader.addClass('dropdownHeader');

    // Add a mouse listener to the header.
    $dropdownHeader.click(function() {
        // Toggle the dropdown list's visibility.
        var $dropdownList = $(".dropdownList", this.parentElement);
        $dropdownList.slideToggle(200);

        // Toggle the dropdownOpen class for the the dropdown list and the
        // header.
        $(this).toggleClass("dropdownOpen", 200);
        $dropdownList.toggleClass("dropdownOpen", 200);
    });
}

/**
 * Adds the functionality of the highlight class to the specified element.
 * 
 * @param {HTMLElement} element the element to add highlight functionality to.
 */
function highlight(element) {
    // Add the highlight class to the element.
    element.classList.add("highlight")
    
    // Add the hover class when the mouse enters each element.
    element.addEventListener("mouseenter", function() {
       $(this).stop(true, true).switchClass("", "hover", 200, "linear"); 
    });
    
    // Remove the hover class when the mouse exits each element.
    element.addEventListener("mouseleave", function() {
        $(this).stop(true, true).switchClass("hover", "", 200, "linear"); 
    });
}

/**
 * Adds the functionality of the select class to the specified element.
 * 
 * @param {HTMLElement} element the element to add select functionality to.
 */
function select(element) {
    // Add the select class to the element.
    $(element).addClass('select');
    
    // Add a click listener to the element.
    $(element).click(function() {
        // Retrieve the currently selected element.
        var $selected = $('.select.selected');
        
        // Remove the selected class from the element.
        $selected.switchClass('selected', '', 200, 'linear');
        
        // Add the selected class to the clicked element.
        $(this).switchClass('', 'selected', 200, 'linear');
        
        // Trigger a select event.
        $(this).trigger("select");
    });
}
