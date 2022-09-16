const WebExtName = "TriggerRemover"
const WebExtVersion = "0.0.2"
const WebExtAuthor = "https://github.com/operatorequals"

const WebExtUrl = browser.runtime.getURL("/")

const WebExtSettingsDefault = {
	'enabled': true,
	'exposure': 0,
}

async function getWebExtTriggers(){
       result = await browser.storage.sync.get('triggers')
       ret = {}
       if (result.triggers !== undefined){
           ret = result.triggers
       }
       console.log("Trigger words found: " + Object.keys(ret).length)
       console.log(result.triggers)
       return ret
}

async function getWebExtSettings(){
	result = await browser.storage.sync.get(['settings'])
	if (result.settings === undefined){
		return WebExtSettingsDefault
	} else {
		return result.settings
	}
}

async function setWebExtExposure(exposure_level){
	if (exposure_level > 100 || exposure_level < 0)
		throw Error(`[${WebExtName}] Exposure level value outside [0,100]`)
	settings = await getWebExtSettings()
	settings['exposure'] = exposure_level
    await browser.storage.sync.set({'settings': settings})
	console.log(`[${WebExtName}] Exposure Level set to: ${settings['exposure']}%`)
	return settings['exposure']
}

async function toggleWebExtEnabled(){
	settings = await getWebExtSettings()
	settings['enabled'] = !settings['enabled']

    await browser.storage.sync.set({'settings': settings})
	console.log(`[${WebExtName}] WebExtEnabled toggled: ${settings['enabled']}`)
	return settings['enabled']
}

console.log(`[${WebExtName}] Loaded Main Script`)
