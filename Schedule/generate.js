addEventListener("load", doStuffInANamedFunctionBecauseBracketsDoesntWantToCooperate);

function doStuffInANamedFunctionBecauseBracketsDoesntWantToCooperate() {
    //request the schedule information from the server:
    $.get("/Schedule/content?callback=addContent");
}

function addContent(res) {
    //create the table:
    var $table = $("<table/>");
    //add the columns and their headers:
    $table.append("<tr><th>Class #<th/><th>Date<th/><th>Tag<th/><th>Topic<th/><th>Project<th/><th>Notes<th/><tr/>");
    
    //add to the table by tag groups:
    for (var tag = 0; tag < res.tags.length; ++i) {
        //add a row for each class in the tag group:
        for (var row = 0; row < res.tags[tag].classes.length; ++row) {
            var shading = tag % 2 == 0 ? "dark" : "light"; //define the shading of the row
            var $row = $("<tr/>"); //start the row
            
            //create each entry in the row:
            var $num = $("<td>" + res.tags[tag].classes[row].num + "<td/>", {"class": shading });
            var $date = $("<td>" +res.tags[tag].classes[row].date + "<td/>", {"class": shading });
            if (row == 0) {
                var $tag = $("<td>" +res.tags[tag].tag + "<td/>", {"class": "tag" + shading });
            }
            //redifine shading to highlight based on the type of class (lecture, lab, presentation):
            switch (res.tags[tag].classes[row].type) {
                case "Lab" : shading = "lab"; break;
                case "Presentation" : shading = "presentation"; break;
                default : shading = "lecture"; break;
            }
            var $topic = $("<td>" +res.tags[tag].classes[row].topic + "<td/>", {"class": shading });
            var $project = $("<td>" +res.tags[tag].classes[row].project + "<td/>", {"class": shading });
            var $notes = $("<td>" +res.tags[tag].classes[row].notes + "<td/>", {"class": shading + (res.tags[tag].classes[row].notes.match(/Quiz[0-9]+/) ? "quiz" : "") });
            
            //append everything to the row:
            $row.append($num).append($date).append($tag).append($topic).append($project).append($notes);
            
            //add the row to the table
            $table.append($row);
        }
    }
    
    $("body").append($table)
}