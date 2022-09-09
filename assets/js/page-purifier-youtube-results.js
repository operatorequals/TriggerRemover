targetNode = null

function removeElement(elem) {
	elem.remove()
}

function containsTrigger(videoElement){
	const triggers = ["eugenia cooney", "eugeniacooney", "anorexi", "weight", "fat"];

	text = videoElement.innerText
	lower_text = text.toLowerCase();
	console.log("Checking:")
	console.log(lower_text)

	for (let trigger_word of triggers){

		trigger_word = trigger_word.toLowerCase()
		console.log(`Checking for '${trigger_word}'...`)

		if (lower_text.includes(trigger_word)){
			console.log(`Word: ${trigger_word} found`)
			return true			
		}
	}
	return false
}
// 	trigger_words = ["Chemical"]
//     browser.storage.sync.set({trigger_words})


// 	browser.storage.sync.get("trigger_words").then((result) => {
//         if (result.hasOwnProperty('trigger_words') && result.trigger_words) {
//         	console.log(result.trigger_words)
//         }
//     };
//     return true
// }

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
/*
<ytd-two-column-search-results-renderer is-search="true" class="style-scope ytd-search" bigger-thumbs-style="DEFAULT" center-results="" style="--ytd-search-chips-bar-width: 1096px;" guide-persistent-and-visible=""><!--css-build:shady--><div id="primary" class="style-scope ytd-two-column-search-results-renderer">
*/	

/*
#dismissible.ytd-video-renderer
*/

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
	console.log("Handling loaded videos:")
	videos = targetNode.querySelectorAll('ytd-video-renderer')
	channels = targetNode.querySelectorAll('ytd-channel-renderer')

	console.log(videos)
	videos.forEach(handleVideo);
	channels.forEach(handleChannel);

	console.log("Watching:")
	console.log(targetNode)

	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);

	// Start observing the target node for configured mutations
	observer.observe(targetNode, config);

	// // Later, you can stop observing
	// observer.disconnect();	
}

window.addEventListener('DOMContentLoaded', function() {
	// const targetNode = document.getElementById('contents');

});

window.onload = function() {
	console.log("Loaded!")
	const contentsObserver = new MutationObserver((mutations, obs) => {
		// const targetNode = document.getElementById('content');
		// const targetNode = document.querySelector('div#content.ytd-app');
		// const targetNode = document.getElementById('contents');
		// const targetNode = document.getElementById('container');
		// const targetNode = document.querySelector('ytd-section-list-renderer')
		// const targetNode = document.querySelector('div#container.ytd-search')
		const targetNode = document

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