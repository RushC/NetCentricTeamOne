var content;

/**
 * Sorts all of the elements using the sorting function and returns a
 * regular array of the sorted elements.
 * 
 * @param {type} sortFunction the function to use to sort the elements.
 * @returns {Array} an array of the sorted elements. Not a jQuery object.
 */
$.prototype.sortElements = function (sortFunction) {
    // Sort the array using the given function.
    return $.makeArray(this).sort(sortFunction);
}

window.onload = function () {
    //JSP compiler adds an empty line before the xml content.
    //we manually remove it.
    content = $.trim($('#rosterDiv').html());
    //now remove the div element that is no longer needed
    $('#rosterDiv').remove();
    // parse the xml
    content = $.parseXML(content);

    DrawTable(0);
};

function DrawTable(sortIndex) {
    if (!window.lastSortIndex) {
        window.lastSortIndex = -1 * sortIndex;
    }

    // Clear the table's current contents.
    $("#rosterTable").html("");

    // Add all of the table's headers.
    $(content).find('object').slice(0, 1).each(function (index, element) {
        // Add a row to the table.
        var row = document.createElement('TR');
        $("#rosterTable").append(row);

        // Iterate through each element in the object.
        $(element).find('string').each(function (index, element) {
            // Add a header to the row.
            var header = document.createElement('TH');
            header.innerHTML = $(element).text();
            row.appendChild(header);
        });
    });

// Add all of the students to the table.
    $(content).find('object').slice(1)
            // Sort all of the objects.
            .sortElements(function (a, b) {
                // Retrieve each of the elements' strings corresponding to
                // the passed index.
                var valueA = $($(a).find('string')[sortIndex]).text();
                var valueB = $($(b).find('string')[sortIndex]).text();

                // Check if the values are numbers.
                if (parseInt(valueA) === parseInt(valueA))
                    valueA = parseInt(valueA);
                if (parseInt(valueB) === parseInt(valueB))
                    valueB = parseInt(valueB);

                if (lastSortIndex === sortIndex) {
                    return valueB > valueA ? 1 : -1;
                }

                return valueA > valueB ? 1 : -1;
            })
            // now we can play with each <object>
            .forEach(function (element, index) {
                // Add a row or header to the table.
                var row = document.createElement('TR');
                $("#rosterTable").append(row);

                // Iterate through each string in the student object..
                $(element)
                        .find('string')
                        .each(function (index, element) {
                            // Add a column to the table row.
                            var column = document.createElement('TD');
                            column.innerHTML = $(element).text();
                            row.appendChild(column);
                        });
            });

    // Add listeners for each of the headers.
    $('TH').each(function (index, element) {
        element.style.cursor = "pointer";
        element.onclick = function () {
            // Sort the table by the clicked header.
            DrawTable(index);
        };
    });

    lastSortIndex = lastSortIndex == sortIndex ? -1 : sortIndex;
}