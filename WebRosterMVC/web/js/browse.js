/**
 * Called when a student's edit button is clicked.
 * 
 * @param {String} id the ID of the student to edit.
 */
function studentEdit(id) {
    // Retrieve the table rows for the student.
    var row = $("tr.view#" + id)[0];
    var editRow = $("tr.edit#" + id)[0];
    
    // Hide the view row and display the edit row.
    var table = $("tbody")[0];
    table.insertBefore(editRow, row);
    row.hidden = true;
    editRow.hidden = false;
}

function deleteStudent(id) {
    $.post("/WebRosterMVC/Controller", {
            id: id,
            type: "student",
            action: "delete",
            success: function(res) {
                document.location.href = document.location.href;
            }
    });
}

function deleteTeam(id) {
    $.post("/WebRosterMVC/Controller", {
            id: $("#teamSelect")[0].value,
            type: "team",
            action: "delete",
            success: function(res) {
                document.location.href = document.location.href;
            }
    });
}

function editStudent(id) {
    // Retrieve the table row for the student.
    var row = $("tr.edit#" + id)[0];
    
    $.post("/WebRosterMVC/Controller", {
            id: id,
            firstName: row.children[0].value,
            lastName: row.children[1].value,
            team: row.children[3].value,
            success: function(res) {
                document.location.href = document.location.href;
            }
    });
}

// Sorts the table by the specifed column.
function sortTable(col) {
    // Retrieve the table.
    var table = $("tbody")[0];
    
    // Retrieve each of the table's rows.
    var headerRow = $("tr")[0];
    var addRow = $("tr").last()[0];
    var studentRows = $("tr.view").slice(1, -1);
    
    // Sort the students.
    studentRows.sort(function(a, b) {
        var valueA = a.children[col].innerHTML || a.children[col].value;
        var valueB = b.children[col].innerHTML || b.children[col].value;
        
        if (Number.isInteger(valueA)) valueA = parseInt(valueA);
        if (Number.isInteger(valueB)) valueB = parseInt(valueB);
        
        return this.sortedCol === col?
                        valueA > valueB? -1 : 1:
                        valueA > valueB? 1 : -1;
    });
    this.sortedCol = this.sortedCol === col? -1 : col;
    
    // Remove all the elements from the table.
    while (table.firstChild)
        table.removeChild(table.firstChild);
    
    // Add the rows back in the sorted order.
    table.appendChild(headerRow);
    for (var  i = 0; i < studentRows.length; i++)
        table.appendChild(studentRows[i]);
    table.appendChild(addRow);
}

