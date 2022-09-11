
const elementHandlers = {
	// Results page
	'ytd-video-renderer' : handleElement,
	'ytd-channel-renderer' : handleElement,
	'ytd-playlist-renderer' : handleElement,

	// Front page
	'ytd-rich-item-renderer' : handleElement,
}

function handleElement(elem){
	console.log("[TriggerRemover] Handling Element:")
	console.log(elem)
	if (containsTrigger(elem)){
		console.log("[TriggerRemover] Removing Element...")
		removeElement(elem)
	}
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

	console.log("[TriggerRemover] Handling already loaded videos/channels/playlists:")
	removeTriggersFromElement(targetNode)

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	console.log("================")
	console.log("[TriggerRemover] Watching results:")
	console.log(targetNode)
}

window.onload = function() {

	console.log("[TriggerRemover] Loaded Youtube Results!")
	findRootElement('ytd-app', watchResults)
}
