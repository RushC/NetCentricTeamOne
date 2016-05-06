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
    // Ensure a page is selected.
    if (!currentPage) {
        alert("You must select a page to add an entity to.");
        return;
    }
    
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
        setCurrentEntity(response);
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
    // Ensure a lecture is selected.
    if (!currentLecture) {
        alert("You must select a lecture to add a page to.");
        return;
    }
    
    page.lectureID = currentLecture.lectureID;
    
    // Save the window's current scroll position.
    var scrollY = window.scrollY;
    
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas($('#previewDiv')[0], {
       onrendered: function(canvas) {
            console.log("Snapshot successful");
            
            // Scroll back to the original position.
            window.scrollTo(0, scrollY);
            
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

                // Display the new page.
                displayPage();
            });
        }
    });
}

/**
 * Deletes the currently selected entity.
 */
function deleteEntity() {
    // Ensure an entity is selected.
    if (!currentEntity) {
        alert("Please select an entity first, then delete it.")
        return;
    }
    
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "deleteEntity",
        entity: JSON.stringify(currentEntity),
        success: function() {
            loadEntities();
            $('#entityPropertiesDiv').slideUp();
        }
        
    // Define the callback function for the POST request.
    });
}

/**
 * Deletes the currently selected lecture.
 */
function deleteLecture() {
    // Ensure a lecture is selected.
    if (!currentLecture) {
        alert("Please select a lecture first, then delete it.");
        return;
    }
    
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
    // Ensure a page is selected.
    if (!currentPage) {
        alert("Please select a page first, then delete it.");
        return;
    }
    
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
function saveEntity(entity) {
    entity = entity || currentEntity;
    var index = entities.indexOf(entity);
    // Ensure there is a selected Entity.
    if (!entity)
        return;
    
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "updateEntity",
        entity: JSON.stringify(entity)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        //  console.log(response);
        
        // Save page.
        savePage();
        
        // Replace the current entity with the updated entity from the server.
        entities[index] = response;
        entity = response;
//        console.log("this one");
//        console.log(entity);
        // Display the current entity.
        //displayEntity();
    });
}

/**
 * Sends a POST request to the server to save the currently selected lecture object.
 */
function saveLecture() {
    // Ensure there is a selected lecture to save.
    if (!currentLecture)
        return;
    
    // Send a POST request to the server.
    $.post(serverURL, {
        action: "updateLecture",
        entity: JSON.stringify(currentLecture)
        
    // Define the callback function for the POST request.
    }).done(function(response) {
        console.log(response);
        
        // Replace the current lecture with the updated entity from the server.
        lectures[lectures.indexOf(currentLecture)] = response;
        currentLecture = response;
        
        // Display the current lecture.
        displayLectures();
    });
}

/**
 * Sends a POST request to the server to save the currently selected Page object.
 */
function savePage() {
    // Ensure there is a selected page to save.
    if (!currentPage)
        return;
    
    // Save the scroll position.
    var scrollY = window.scrollY;
    
    // Create a canvas element from the previewDiv using the html2canvas library.
    html2canvas($('#previewDiv')[0], {
       onrendered: function(canvas) {
            console.log("Snapshot successful");
            
            // Scroll back to the original position.
            window.scrollTo(0, scrollY);

            // Set the page's image property to the data url from the canvas.
            currentPage.pageAudioURL = canvas.toDataURL();
            
            // Send a POST request to the server.
            $.post(serverURL, {
                action: "updatePage",
                page: JSON.stringify(currentPage)

            // Define the callback function for the POST request.
            }).done(function(response) {
                console.log(response);
                
                // Retrieve the index of the page that was changed.
                var index = pages.indexOf(currentPage);
                
                // Replace the current page with the updated entity from the server.
                pages[index] = response;
                currentPage = response;

                // Replace the image source.
                $('img#' + currentPage.pageID)[0].src = "/ShowAndTellProject/" 
                        + currentPage.pageAudioURL;
            });
            
        }
    });
    
}


