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

function removeElement(elem) {
	elem.remove()
}

function containsTrigger(videoElement){
	console.log("-> Checking:")
	console.log(videoElement.innerText)

	for (let trigger_word in triggers){
		regex_flags = "g"
		checked_text = videoElement.innerText
		console.log(`[+] Checking for '${trigger_word}'...`)
		console.log(triggers[trigger_word])

		console.log("[1] Checking case_sensitive")
		// If case_sensitive is NOT set - to lower case
		if (!triggers[trigger_word]["case_sensitive"]) {
			regex_flags += "i"
			// checked_text = checked_text.toLowerCase()
			// trigger_word = trigger_word.toLowerCase()
		}

		console.log("[2] Checking whole_word")
		// If whole_word is set - create a regex with greedy whitespaces
		if (triggers[trigger_word]["whole_word"]) {
			trigger_word = `\\s*${trigger_word}\\s*`
		}

		console.log("[+] Creating regex")
		trigger_word = new RegExp(trigger_word, regex_flags)

		console.log("[!] Checking existence: ")
		console.log(checked_text.match(trigger_word))
		if (checked_text.match(trigger_word)){
			console.log(`[#] Word: ${trigger_word} found`)
			return true
		}
	}
	console.log("[#] Clear, moving on...")
	return false
}

function handleVideo(videoElement){
	console.log("Handling Video:")
	console.log(videoElement)
	if (containsTrigger(videoElement)){
		console.log("Removing...")
		removeElement(videoElement)
	}
}

function handleChannel(channelElement){
	console.log("Handling Channel:")
	console.log(channelElement)
	if (containsTrigger(channelElement)){
		console.log("Removing...")
		removeElement(channelElement)
	}
}

function watchResults(targetNode){

	// Options for the observer (which mutations to observe)
	const config = { attributes: true, childList: true, subtree: true };

	// Callback function to execute when mutations are observed
	const callback = (mutationList, observer) => {
		for (const mutation of mutationList) {

			mutation.addedNodes.forEach(function(added_node) {
				// console.log(added_node)
				videos = added_node.parentElement.querySelectorAll('ytd-video-renderer')
 				channels = added_node.querySelectorAll('ytd-channel-renderer')
				console.log("Added more videos/channels...")
				// console.log(videos)

				videos.forEach(handleVideo);
				channels.forEach(handleChannel);
			});
		}
	};

	console.log("Handling loaded videos/channels:")
	videos = targetNode.querySelectorAll('ytd-video-renderer')
	channels = targetNode.querySelectorAll('ytd-channel-renderer')
	// Playlists: ytd-playlist-renderer

	videos.forEach(handleVideo);
	channels.forEach(handleChannel);

	console.log("================")
	console.log("Watching:")
	console.log(targetNode)

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);
}

window.onload = function() {


	console.log("Loaded!")
	const contentsObserver = new MutationObserver((mutations, obs) => {

		const targetNode = document.querySelector('ytd-app');
		// const targetNode = document.getElementById('content');
		// const targetNode = document.querySelector('div#content.ytd-app');
		// const targetNode = document.getElementById('contents');
		// const targetNode = document.getElementById('container');
		// const targetNode = document.querySelector('ytd-section-list-renderer')
		// const targetNode = document.querySelector('div#container.ytd-search')
		// const targetNode = document

		if (targetNode) {
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
