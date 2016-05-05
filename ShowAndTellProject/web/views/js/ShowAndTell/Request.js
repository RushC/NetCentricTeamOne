/* 
 * This script defines functions to send requests to the server.
 */

// The URL to send requests to.
var serverURL = "/ShowAndTellProject/Controller";

/**
 * Adds and saves the specified entity to the server and displays in the
 * preview div.
 *
 * @param {Entity} entity - an Entity object to add. The lecture and page numbers
 *                          will be set to those of the currently selected
 *                          page.
 */
function addEntity(entity) {
    // Set the lecture and page number of the entity.
    entity.lectureID = currentPage.lectureID;
    entity.pageID = currentPage.pageID;
    
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "addEntity",
        entity: JSON.stringify(entity)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Add the entity sent from the server to the entities list.
        entities.push(response);
        currentEntity = response;
        
        // Display the entity.
        displayEntity();
    });
}

/**
 * Adds and saves the specified lecture to the server and displays it.
 *
 * @param {Lecture} lecture - a Lecture object to save.
 */
function addLecture(lecture) {
    console.log(lecture);
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "addLecture",
        lecture: JSON.stringify(lecture)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Add the lecture sent from the server to the lectures list.
        lectures.push(response);
        currentLecture = response;
        
        // Reload the lectures.
        loadLectures();
    });
}

/**
 * Adds and saves the specified page to the server and displays in the
 * preview div.

 * @param {Page} page - a Page object to save.
 */
function addPage(page) {
    page.lectureID = currentLecture.lectureID;
    
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas($('#previewDiv')[0], {
       onrendered: function(canvas) {
            console.log("Snapshot successful");
            
            // Set the page's image property to the data url from the canvas.
            page.pageAudioURL = canvas.toDataURL();
            console.log(canvas.toDataURL());
            
            // Send a POST request to the server.
            $.post(serverURL, {
                action: "addPage",
                page: JSON.stringify(page)

            // Define the callback function for the POST request.
            }).done(function(response) {
                console.log(response);

                // Add the page sent from the server to the entities list.
                pages.push(response);
                currentPage = response;

                // Display the entity.
                displayPages();
            });
        }
    });
}

/**
 * Deletes the currently selected entity.
 */
function deleteEntity() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "deleteEntity",
        entity: JSON.stringify(currentEntity)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log("Deleted current entity");
        
        // Remove the current entity.
        removeEntity();
    });
}

/**
 * Deletes the currently selected lecture.
 */
function deleteLecture() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "deleteLecture",
        lecture: JSON.stringify(currentLecture),
        success: function(response) {
            console.log("Deleted current lecture");
        
            // Remove the current lecture.
            removeLecture();
        }
    });
}

/**
 * Deletes the currently selected page.
 */
function deletePage() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "deletePage",
        page: JSON.stringify(currentPage),
        success: function(response) {
            console.log("Deleted current page");

            // Remove the current page.
            removePage();
        }
    });
}

/**
 * Sends a POST request to the server to retrieve all of the Entity objects for
 * the currently selected Page.
 */
function loadEntities() {
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "getEntities",
        page: JSON.stringify(currentPage)
        
    // Define the callback function for the POST request.
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

/**
 * Sends a POST request to the server to save the currently selected Entity
 * object.
 */
function saveEntity() {
    // Send a POST request to the server.
    $.post({
        action: "updateEntity",
        entity: JSON.stringify(currentEntity)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Replace the current entity with the updated entity from the server.
        entities[entities.indexOf(currentEntity)] = response;
        currentEntity = response;
        
        // Display the current entity.
        displayEntity();
    });
}

/**
 * Sends a POST request to the server to save the currently selected lecture object.
 */
function saveLecture() {
    // Send a POST request to the server.
    $.post({
        action: "updateLecture",
        entity: JSON.stringify(currentLecture)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Replace the current lecture with the updated entity from the server.
        lectures[lectures.indexOf(currentLecture)] = response;
        currentLecture = response;
        
        // Display the current lecture.
        displayLecture();
    });
}

/**
 * Sends a POST request to the server to save the currently selected Page object.
 */
function savePage() {
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas($('#previewDiv')[0], {
       onrendered: function(canvas) {
            console.log("Snapshot successful");

            // Set the page's image property to the data url from the canvas.
            currentPage.pageAudioURL = canvas.toDataURL();
            
            // Send a POST request to the server.
            $.post({
                action: "updatePage",
                entity: JSON.stringify(currentPage)

            // Define the callback function for the POST request.
            }).done(function(response) {
                console.log(response);

                // Replace the current page with the updated entity from the server.
                pages[pages.indexOf(currentPage)] = response;
                currentPage = response;

                // Display the current page.
                displayPage();
            });
        }
    });
}


