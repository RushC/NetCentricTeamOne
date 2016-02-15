window.addEventListener("load", function() {
	insertScore();
});

/**
 * Inserts the score data into the table.
 */
function insertScore() {
	var total = getValue("total");
	var correct = getValue("correct");

	document.querySelector("#totalCell").innerHTML = total;
	document.querySelector("#correctCell").innerHTML = correct;
	document.querySelector("#incorrectCell").innerHTML = total - correct;
	document.querySelector("#scoreCell").innerHTML = (correct / total * 100) + "%";
}