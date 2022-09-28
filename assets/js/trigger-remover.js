const WebExtName = "TriggerRemover"
const WebExtVersion = "0.3.1"
const WebExtAuthor = "https://github.com/operatorequals"

const TriggerListMetaUrl = "https://raw.githubusercontent.com/operatorequals/TriggerRemover/master/trigger_lists/meta.json"

const WebExtUrl = browser.runtime.getURL("/")

const WebExtSettingsDefault = {
	'enabled': true,
	'exposure': 0,
}

const ExposureLevelMessages = {
    0 :  "Will block <b>ALL</b> found Triggers",
    30:  "<b>Some</b> Triggers here and there",
    70:  "A bit <b>more</b> going on",
    99:  "Closer to the <b>uncensored Internet</b>!",
    100: "You are attending the Internet. <b>Congratulations!</b>",
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

async function addTriggerWord(trigger_word, trigger_word_obj){
	result = await browser.storage.sync.get('triggers')
	ret = {}
	if (result.triggers !== undefined){
	   ret = result.triggers
	}
	ret[trigger_word] = trigger_word_obj
	await browser.storage.sync.set({'triggers': ret})
	console.log(`[${WebExtName}] Trigger word added: '${trigger_word}'`)
	return true
}

async function removeTriggerWord(trigger_word){
	result = await browser.storage.sync.get('triggers')
	if (result.triggers === undefined) return false // If empty there is nothing to remove
	if (result.triggers[trigger_word] === undefined) return false // Trigger word not found
	delete result.triggers[trigger_word]
	browser.storage.sync.set({'triggers': result.triggers})
	console.log(`[${WebExtName}] Trigger word deleted: '${trigger_word}'`)
	return true
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

const escapeHtml = (unsafe) => {
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}


console.log(`[${WebExtName}] Loaded Main Script`)
