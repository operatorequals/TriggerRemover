const WebExtName = "TriggerRemover"
const WebExtVersion = "0.0.1"
const WebExtAuthor = "https://github.com/operatorequals"

const WebExtUrl = browser.runtime.getURL("/")


async function getWebExtEnabled(){
	result = await browser.storage.sync.get(['enabled'])
	console.log("Storage:" + result.enabled)
    if (result.enabled === undefined) {
		return true
	} else {
		return result.enabled
	}
}


async function toggleWebExtEnabled(){
	WebExtEnabled = await getWebExtEnabled()
	WebExtEnabled = !WebExtEnabled
    await browser.storage.sync.set({'enabled': WebExtEnabled})
	console.log(`[${WebExtName}] WebExtEnabled toggled: ${WebExtEnabled}`)
	return WebExtEnabled
}

console.log(`[${WebExtName}] Loaded Main Script`)
