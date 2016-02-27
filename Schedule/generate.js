addEventListener("load", doStuffInANamedFunctionBecauseBracketsDoesntWantToCooperate);

function doStuffInANamedFunctionBecauseBracketsDoesntWantToCooperate() {
    //request the schedule information from the server:
    $.get("/Schedule/content?callback=addContent");
}

function addContent(res) {
	res = JSON.parse(res);
    //create the table:
    var $table = $("<table><tr><th>Class #</th><th>Date</th><th>Tag</th><th>Topic</th><th>Project</th><th>Notes</th></tr></table>");
    //add the columns and their headers:
    $("body").append($table);
    //add to the table by tag groups:
    for (var tag = 0; tag < res.length; ++tag) {
        //add a row for each class in the tag group:
        for (var row = 0; row < res[tag].classes.length; ++row) {
            var shading = tag % 2 == 0 ? "dark" : "light"; //define the shading of the row
            var $row = $("<tr/>"); //start the row
            
            //create each entry in the row:
            var $num = $("<td>" + res[tag].classes[row].num + "</td>").attr("class", shading);
            var $date = $("<td>" + res[tag].classes[row].date + "</td>").attr("class", shading);
            if (row == 0) {
                var $tag = $("<td headers=\"tag\" rowspan=" + res[tag].classes.length + " >" +res[tag].tag + "</td>").attr("class", shading);
            }
			//else { var $tag = $("<td></td>").attr("class", shading); }
            //redifine shading to highlight based on the type of class (lecture, lab, presentation):
            switch (res[tag].classes[row].type) {
                case "Lab" : shading = "lab"; break;
                case "Presentation" : shading = "presentation"; break;
                default : shading = "lecture"; break;
            }
            var $topic = $("<td>" + res[tag].classes[row].topic + "</td>").attr("class", shading);
            var $project = $("<td>" + res[tag].classes[row].project + "</td>").attr("class", shading);
            if (res[tag].classes[row].notes && res[tag].classes[row].notes.search("Quiz") != -1) { 
				shading = shading + " quiz";
			}
			var $notes = $("<td>" + res[tag].classes[row].notes + "</td>").attr("class", shading);
            //append everything to the row:
            $row.append($num).append($date);
			if ($tag) {
				$row.append($tag);
			}
			$row.append($topic).append($project).append($notes);
			//$tag.attr("rowspan", res[tag].classes.length);
            
            //add the row to the table
            $table.append($row);
        }
    }
	
	
	$("body").append($table);
	//fix undefined shit:
	$("td").each(function() {
		if (this.innerHTML == "undefined")
		this.innerHTML = " ";
	});
}