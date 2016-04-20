// Run this when the document is loaded.
window.onload = function() {
	//Clear sidebar
	parent.document.getElementById("sframe").contentDocument.location = "null";
	
	// Create a table of contents element.
	var contents = createContentsElement();

	// Retrieve each of the h1 elements in the body.
	var h1 = index(document.body, "H1");
	for (var i in h1) {
		// Create a link for each element.
		var h1link = scrollLink(h1[i]);

		// Set the text for the link to the text of the element.
		h1link.innerHTML = (Number(i) + 1) + ". " + h1[i].innerHTML;

		// Add the link to the end of the table of contents.
		contents.appendChild(h1link);

		// Repeat the process for every h2 in the div after the element.
		var h2 = index(h1[i].nextElementSibling, "H2");
		for (var j in h2) {
			var h2link = scrollLink(h2[j]);
			h2link.innerHTML = (Number(i) + 1) + "." + (Number(j) + 1) + ". " + h2[j].innerHTML;
			contents.appendChild(h2link);
			h2link.style.paddingLeft = "20px";
		}
	}

	/**
	 * Retrieves all of the children for a
	 * specific tag type from the given
	 * node.
	 *
	 * @param node - the node to retrieve the children
	 *				 from
	 * @param tag  - the tag name to search the children
	 *				 for
	 * @return     - an array of all children found
	 */
	function index(element, tag) {
		// Create the array to eventually return.
		var found = [];

		// Check for the parameters.
		if (!element || !element.children || !tag)
			return found;

		// Iterate through all of the children of the given node.
		var children = element.children;
		for (var i = 0; i < children.length; i++) {
			// Check if the child's node matches the given tag.
			if (children[i].tagName == tag)
				// Add the child to the array.
				found.push(children[i]);

			// Recursively search each child for more elements
			// with the given tag.
			found = found.concat(index(children[i], tag));
		}

		// Return the array.
		return found;
	}

	/**
	 * Creates an element that scrolls to the specified element
	 * when clicked.
	 *
	 * @param scrollElement - the element to scroll to when the 
	 *						  clickElement is clicked
	 * @return 				- the created element or null if
	 *						  insufficient parameters were passed
	 */
	function scrollLink(scrollElement) {
		// Check for parameters.
		if (!scrollElement)
			return null;

		// Create the element.
		var element = document.createElement('A');

		// Set the onclick listener.
		element.onclick = function() {
			// The html part of the selector is needed for Internet Explorer.
			$("html, body").animate({
				// Animate the scrollTop property to the scrollElement's offset from the top.
				scrollTop: $(scrollElement).offset().top
			});
		}

		// Modify the style of the link.
		element.style.display = "block";
		element.style.cursor = "pointer";
		element.classList.add("scroll_link");

		// Add the invert class when hovering over the link.
		element.onmouseenter = function() {
			// Using jQueryUI to animate the transition.
			$(element).switchClass("", "invert", { duration: 75, ease: "easeOutQuad" });
		}
		// Remove the invert class when hovering over the link.
		element.onmouseleave = function() {
			$(element).switchClass("invert", "", { duration: 75, ease: "easeOutQuad" });
		};

		return element;
	}

	/**
	 * Creates and inserts a div element that can be used to
	 * display a table of contents by appending scrollLinks to
	 * it. 
	 *
	 * This function also creates a toggle element which is
	 * designed to take up very little space on the right edge
	 * and allow the user to open the table of contents by
	 * hovering over it.
	 *
	 * The table of contents element is given the ID #table_of_contents
	 * and the toggle element is given the ID #table_of_contents_toggle.
	 *
	 * @returns - the created table of contents element. Append scrollLink
	 *			  elements to it (created with the scrollLink function) to
	 *			  make use of it.
	 */
	function createContentsElement() {
		// Create a div element to hold the table of contents.
		var contents = document.createElement("DIV");
		contents.id = "table_of_contents";

		// Fix the table on the right edge.
		contents.style.right = "0px";
		contents.style.position = "fixed";
		contents.style.overflowY = "scroll";

		// Create an element to open the table of contents.
		var contentsToggle = document.createElement("DIV");
		contentsToggle.id = "table_of_contents_toggle";

		// Fix the toggle a little past the right edge..
		contentsToggle.style.right = "-10px";
		contentsToggle.style.position = "fixed";

		// Have the contentsToggle open the table of contents
		// when hovered over.
		contentsToggle.onmouseenter = function() {
			$(contents).stop().toggle(500);
			$(contentsToggle).stop().toggle(500);
		}

		// Have the toggle reappear and table disappear when
		// the mouse leaves the table.
		contents.onmouseleave = function() {
			$(contents).stop().toggle(500);
			$(contentsToggle).stop().toggle(500);
		}

		// Hide the table initially.
		contents.hidden = true;

		// Add the table and toggle to the beginning of the page.
		document.body.insertBefore(contents, document.body.children[0]);
		document.body.insertBefore(contentsToggle, contents);

		return contents;
	}
};
