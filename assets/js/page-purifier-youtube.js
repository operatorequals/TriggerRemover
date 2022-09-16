
MainObserver = null

const elementHandlers = {
	// Results page
	'/results': {
		'ytd-video-renderer' : handleElement,
		'ytd-channel-renderer' : handleElement,
		'ytd-playlist-renderer' : handleElement,
	},
	// Watch page
	'/watch': {
		// related videos:
		'ytd-compact-video-renderer' : handleElement,
		// 'ytd-comment-renderer' : handleElement,
	}
}
const PATHS = Object.keys(elementHandlers)

function handleElement(elem){
	console.log("[TriggerRemover] Handling Element:")
	console.log(elem)
	if (containsTrigger(elem)){
		console.log("[TriggerRemover] Removing Element...")
		removeElement(elem)
	}
}

function removeTriggersFromElement(node){
	// Chrome sometimes brings 'null' added nodes here
	if (node === null){
		return
	}
	// Element tags are grouped per page
	// so we don't look for everything everywhere
	for (tag in elementHandlers[location.pathname]){
		elems = node.querySelectorAll(tag)
		elems.forEach(elementHandlers[location.pathname][tag])
	}
}

function watchPage(targetNode){

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
	MainObserver = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	MainObserver.observe(targetNode, config);

	console.log("================")
	console.log("[TriggerRemover] Watching Elements under:")
	console.log(targetNode)
}

async function init(){

	// If plugin is disabled
	settings = await getWebExtSettings()
	if (!settings.enabled){
		console.log(`[TriggerRemover] plugin is disabled. Exiting...`)
		if (MainObserver) MainObserver.disconnect()
		return false
	}

	// If current path is not handled
	if (PATHS.indexOf(location.pathname) == -1){
		console.log(`[TriggerRemover] No handlers for page '${location}'. Exiting...`)
		if (MainObserver) MainObserver.disconnect()
		return false
	}

	loadTriggers() // Loads the TRIGGERS global
	findRootElement('ytd-app', watchPage)
	console.log(`[TriggerRemover] Loaded Youtube Page ${location.pathname}!`)
}

// Taken from:
// https://stackoverflow.com/a/34100952
/*
	Youtube does not refresh pages,
	but pushes new pages to history.
	This behaviour does NOT trigger
	content scripts, and needs this workaround
*/
document.addEventListener('yt-navigate-start', init);

if (document.body) init();
else document.addEventListener('DOMContentLoaded', init);
