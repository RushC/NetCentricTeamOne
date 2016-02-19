/**
 * Adds or updates the cookie with the given key-value pair.
 * 
 * @param key - the key of the cookie to add/update
 * @param value - the value to set the cookie's value to
 * @param cookieSource (optional) - the object that contains the cookie
 *									variable (default is document)
 */
function setValue(key, value, cookieSource) {
	var source = cookieSource || document;
	source.cookie = key + "=" + encodeURIComponent(value) + ";";
}

/**
 * Retrieves the value for the specified key from the
 * cookie.
 *
 * @param key - the key to search for in the list of cookies
 * @param cookieSource (optional) - the object that contains the cookie
 *									variable (default is document)
 */
 function getValue(key, cookieSource){
	var source = cookieSource || document;

	// Break the cookie string into an array of cookies.
	var cookies = source.cookie.split('; ');
	for (var i = 0; i < cookies.length; i++) {
		// Break the cookie into its key and value.
		var cookie = cookies[i].split('=');
		// Check if the key is the one we are looking for.
		if (cookie[0] == key)
			return decodeURIComponent(cookie[1]);
	}
}