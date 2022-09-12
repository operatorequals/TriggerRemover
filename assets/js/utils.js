// ==================================================
// Globals
// ==================================================
TRIGGERS = {}
// HITS = {}

// ==================================================
// Functions
// ==================================================

function loadTriggers(){
    browser.storage.sync.get(['triggers'])
        .then((result) => {
            TRIGGERS = result.triggers;
            console.log("Trigger words found: " + Object.keys(TRIGGERS).length)
            for (trigger_word in TRIGGERS){
                TRIGGERS[trigger_word]['matcher'] = createTriggerRegex(trigger_word, TRIGGERS[trigger_word])
            }            
    });
}


// Taken from:
// https://stackoverflow.com/a/9310752
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}


/*
    Maybe add feature to replace element with custom HTML
    in the future
*/
function removeElement(elem) {
    elem.remove()
    // elem.innerText = "This content has been hidden by plugin"
}

function createTriggerRegex(trigger_word, trigger_entry){
    regex_flags = "m"   // multiline is the default

    console.log(`[+] Checking for '${trigger_word}'...`)
    // console.log(trigger_entry)

    // console.log("[1] Checking case_sensitive")
    // If case_sensitive is NOT set - to lower case
    if (!trigger_entry["case_sensitive"]) {
        regex_flags += "i"
    }

    // console.log("[2] Checking whole_word")
    // If whole_word is set - create a regex with greedy whitespaces
    if (trigger_entry["whole_word"]) {
        trigger_word = `\\s+${trigger_word}\\s+`
        // console.log(`[2][1] Whole word ${trigger_word}`)
    }

    // If regex is not set - escape all regex characters
    // console.log("[3] Checking regex")
    if (!trigger_entry["regex"]) {
        // console.log("[3][1] Escape regex chars")
        trigger_word = escapeRegExp(trigger_word)
    }

    trigger_word_regex = new RegExp(trigger_word, regex_flags)
    console.log(`[+] Creating regex for '${trigger_word_regex}'`)
    return trigger_word_regex
}


function findRootElement(tag, callback){
    // Look at the whole document and find the Videos container element
    const contentsObserver = new MutationObserver((mutations, obs) => {
        const targetNode = document.querySelector(tag);

        if (targetNode) {
            // When the element is found stop looking!
            obs.disconnect();
            callback(targetNode)
        }
    });

    // Look at the whole document at first!
    contentsObserver.observe(document, {
      childList: true,
      subtree: true
    });    
}


function containsTrigger(element){
    checked_text = element.innerText
    // console.log(checked_text)
    for (let trigger_word in TRIGGERS){
        trigger_entry = TRIGGERS[trigger_word]
        trigger_word_regex = TRIGGERS[trigger_word]['matcher']

        if (checked_text.match(trigger_word_regex)){
            console.log(`[#] Word: ${trigger_word} found`)
            // countHit(trigger_word)
            return true
        }
    }
    console.log("[#] Clear, moving on...")
    return false
}


// function countHit(trigger_word){
//     if (!HITS[trigger_word])
//         HITS[trigger_word] = 0
//     else
//         HITS[trigger_word]++
// }

// ==================================================
// Initial Calls
// ==================================================


// ==================================================
// Unused
// ==================================================

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

console.log("[TriggerRemover] Loaded Utility script")
