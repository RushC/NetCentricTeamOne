/* 
 * This script defines functions to send requests to the server.
 */

// The URL to send request to.
var serverURL = "/ShowAndTellProject/Controller";

/**
 * Sends a POST request to the server to retrieve all of the Entity objects for
 * the currently selected Page.
 */
function loadEntities() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "getEntities",
        page: JSON.stringify(currentPage)
        
    // Define the callback function for the POST request,
    }).done(function(response) {
        console.log(response);
        
        // Set the entities to the response.
        entities = response;
        
        // Display the entities.
        displayEntities();
    });
}

/**
 * Sends a POST request to the server to retrieve all of the Lecture objects
 * currently stored in the database.
 */
function loadLectures() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "getLectures"
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Set the lectures to the response.
        lectures = response;
        
        // Display the lectures.
        displayLectures();
    });
}

/**
 * Sends a POST request to the server to retrieve all of the Page objects for
 * the currently selected Lecture.
 */
function loadPages() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "getPages",
        lecture: JSON.stringify(currentLecture)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Set the pages to the response.
        pages = response;
        
        // Display the pages.
        displayPages();
    });
}


