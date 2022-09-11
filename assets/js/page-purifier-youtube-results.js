targetNode = null
triggers = null

browser.storage.sync.get(['triggers'])
    .then((result) => {
        triggers = result.triggers;
		console.log("Trigger words loaded: " + Object.keys(triggers).length)
    });

// Taken from:
// https://stackoverflow.com/a/39905590
/*
String.prototype.fuzzy = function(term, ratio=0.7) {
    var string = this.toLowerCase();
    var compare = term.toLowerCase();
    var matches = 0;
    if (string.indexOf(compare) > -1) return true; // covers basic partial matches
    for (var i = 0; i < compare.length; i++) {
        string.indexOf(compare[i]) > -1 ? matches += 1 : matches -=1;
    }
    return (matches/this.length >= ratio || term == "")
};
*/

// Taken from:
// https://stackoverflow.com/a/9310752
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

function removeElement(elem) {
	/*
		Maybe add feature to replace element with custom HTML
		in the future
	*/
	elem.remove()
	// elem.innerText = "This content has been hidden by plugin"
}

function containsTrigger(element){
	// console.log("-> Checking:")
	console.log(element.innerText)

	for (let trigger_word in triggers){
		regex_flags = "m"	// multiline is the default
		key = trigger_word

		checked_text = element.innerText
		console.log(`[+] Checking for '${trigger_word}'...`)
		console.log(triggers[trigger_word])

		// console.log("[1] Checking case_sensitive")
		// If case_sensitive is NOT set - to lower case
		if (!triggers[key]["case_sensitive"]) {
			regex_flags += "i"
		}

		// console.log("[2] Checking whole_word")
		// If whole_word is set - create a regex with greedy whitespaces
		if (triggers[key]["whole_word"]) {
			trigger_word = `\\s+${trigger_word}\\s+`
			console.log(`[2][1] Whole word ${trigger_word}`)
		}

		// If regex is not set - escape all regex characters
		// console.log("[3] Checking regex")
		if (!triggers[key]["regex"]) {
			console.log("[3][1] Escape regex chars")
			trigger_word = escapeRegExp(trigger_word)
		}

		console.log(`[+] Creating regex for '${trigger_word}'`)
		trigger_word = new RegExp(trigger_word, regex_flags)

		// console.log("[!] Checking existence: ")
		console.log(checked_text.match(trigger_word))
		if (checked_text.match(trigger_word)){
			console.log(`[#] Word: ${trigger_word} found`)
			return true
		}
	}
	console.log("[#] Clear, moving on...")
	return false
}


function handleElement(elem){
	console.log("Handling Element:")
	console.log(elem)
	if (containsTrigger(elem)){
		console.log("Removing Element...")
		removeElement(elem)
	}
}

const elementHandlers = {
	// Results page
	'ytd-video-renderer' : handleElement,
	'ytd-channel-renderer' : handleElement,
	'ytd-playlist-renderer' : handleElement,

	// Front page
	'ytd-rich-item-renderer' : handleElement
}

function removeTriggersFromElement(node){
	for (tag in elementHandlers){
		elems = node.querySelectorAll(tag)
		elems.forEach(elementHandlers[tag])
	}
}

function watchResults(targetNode){

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {

			mutation.addedNodes.forEach(function(added_node) {
				removeTriggersFromElement(added_node.parentElement)
			});
		}
	};

	console.log("Handling already loaded videos/channels:")
	removeTriggersFromElement(targetNode)

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	console.log("================")
	console.log("Watching:")
	console.log(targetNode)
}

window.onload = function() {

	console.log("Loaded!")

	// Look at the whole document and find the Videos container element
	const contentsObserver = new MutationObserver((mutations, obs) => {

		const targetNode = document.querySelector('ytd-app');

		if (targetNode) {
			// When the element is found stop looking!
			obs.disconnect();
			watchResults(targetNode)
			return;
		}
	});

	contentsObserver.observe(document, {
	  childList: true,
	  subtree: true
	});
}
