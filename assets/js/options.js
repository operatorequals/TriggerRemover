
function importable(version){
    return WebExtVersion >= version
}

function showMessage(message, success){
    type = 'alert-danger'
    if (success) {type = 'alert-success'}
    let messageElm = document.createElement("div")
    messageElm.innerHTML = message
    messageElm.setAttribute("class", `alert ${type}`)
    document.body.prepend(messageElm);
    // To keep the message on screen long enough
    // to be read
    timeout = message.split(" ").length * 350
    setTimeout(() => {
    	messageElm.remove()
    }, timeout)
}

function importList(file_contents_obj, overwrite){
    console.log(file_contents_obj)
    meta = file_contents_obj.meta

    // // Backward compatibility test
    // if (!importable(meta.version)){
    //     showSuccess("List file is old and cannot be imported!")
    // }

    // Keys are in Base64 - to not trigger the users
    if (meta.obfuscated){
        triggers = {}
        for (let trigger_entry in file_contents_obj.triggers){
            triggers[atob(trigger_entry)] = file_contents_obj.triggers[trigger_entry]
        }
    } else {
        triggers = file_contents_obj.triggers
    }
    word_count = Object.keys(triggers).length
    console.log(`Adding ${Object.keys(triggers).length} words`)

    if (overwrite) {
        console.log("Overwriting!")
        browser.storage.sync.set({triggers})
            .then(() => {
                showMessage(`List overwritten successfully (${word_count} words)!`, true)
        });
    } else {
        console.log("Updating!")
        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let old_triggers = result.triggers;
                if (old_triggers) {
                    triggers = {
                        ...old_triggers,
                        ...triggers
                    }
                }
                console.log(triggers)

                browser.storage.sync.set({'triggers':triggers})
                    .then(() => {
                        showMessage(`List updated successfully (${word_count} words)!`, true)
                });
        });
    }
}

function removeList(file_contents_obj){
    meta = file_contents_obj.meta
    if (meta.obfuscated){
        triggers = {}
        for (let trigger_entry in file_contents_obj.triggers){
            triggers[atob(trigger_entry)] = file_contents_obj.triggers[trigger_entry]
        }
    } else {
        triggers = file_contents_obj.triggers
    }
    console.log(`Removing ${Object.keys(triggers).length} words`)

    browser.storage.sync.get(['triggers'])
        .then((result) => {
            word_count = 0
            new_triggers = result.triggers
            // Delete each world that came from the list
            for (trigger_word in triggers){
                console.log(`[-] Removing ${trigger_word}`)
                if (new_triggers[trigger_word]){
                    delete new_triggers[trigger_word]
                    word_count++
                }
            }
            browser.storage.sync.set({'triggers': new_triggers})
                .then(() => {
                    showMessage(`Trigger Words removed (${word_count} words)!`, true)
            });
        });
}


function toggleRemoteList(event){
    list_id = event.target.name
    enabled = event.target.checked
    fileUrl = `https://raw.githubusercontent.com/\
operatorequals/TriggerRemover/master/\
trigger_lists/${list_id}.triggers.json`
    // Get the selected list from the public lists
    console.log(fileUrl)
    console.log(enabled)
    fetch(fileUrl)
      .then((response) => response.json())
      .then((data) => {
        file_contents_obj = data
        if (enabled)
            importList(file_contents_obj, false)
        else
            removeList(file_contents_obj)
    })
      .catch((error) => {
        showMessage("URL could not be reached or did not contain Trigger Word List", false)
    });

}

// Taken from:
// https://stackoverflow.com/a/18197341
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

$(document).ready(() => {
    const formAddElm = $('form#add');
    const nameElm = $('#word');
    const wholeWordElm = $('#whole-word')[0];
    const caseSensitiveElm = $('#case-sensitive')[0];
    const regexElm = $('#regex')[0];

    const formImportElm = $('form#import');
    const fileImportElm = $('#trigger_list_file')[0];
    const fileUrlImportElm = $('#trigger_list_url');
    const fileImportOwriteElm = $('#overwrite_trigger_list')[0];

    const formExportElm = $('form#export');
    const listNameElm = $('#list_name');
    const listAuthorElm = $('#list_author');
    const listExportObfuscateElm = $('#obfuscate_trigger_list')[0];

    // Preset List toggle actions
    for (key of PresetListKeys)
        $(`input#${key}-list-url`).on('change', toggleRemoteList)


    formAddElm.on('submit', (event) => {
        const self = this;

        //bring triggers from storage
        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let triggers = result.triggers;
                if (!triggers) {
                    triggers = {};
                }
                // console.log(triggers)
                trigger_word = nameElm.val().trim()
                triggers[trigger_word] = {
                	case_sensitive: caseSensitiveElm.checked,
                	whole_word: wholeWordElm.checked,
                	regex: regexElm.checked,
                }

                //store triggers in the storage
                browser.storage.sync.set({'triggers': triggers})
                    .then(() => {
                	    nameElm.val('');
                        showMessage("Word added successfully!", true)
                });
        });
        return false; //disable default form submit action
    });

    $('button#del-word-button').on('click', (event) => {
        //bring triggers from storage
        trigger_word = nameElm.val().trim()
        if (!trigger_word) return false
        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let triggers = result.triggers;
                if (!triggers) {
                    triggers = {};
                }
                // console.log(triggers)
                trigger_word = nameElm.val().trim()
                if (triggers[trigger_word]){
                    delete triggers[trigger_word]
                } else {
                    showMessage("Word not found in stored Trigger List!", false)
                    return false
                }

                //store triggers in the storage
                browser.storage.sync.set({'triggers': triggers})
                    .then(() => {
                        nameElm.val('');
                        showMessage("Word deleted successfully!", true)
                });
        });
    });

    formImportElm.on('submit', (event) => {
        event.preventDefault()
	    const self = this;
        const overwrite = fileImportOwriteElm.checked
        remote_list = false

        if (fileImportElm.files.length != 0){
    	    file = fileImportElm.files[0]
            remote_list = false
        } else if (fileUrlImportElm.val()) {
            fileUrl = fileUrlImportElm.val().trim()
            remote_list = true
        } else {
            showMessage("Neither URL or File was provided", false)
            return false
        }

        console.log(`Importing List (remote list: ${remote_list})`)

        if (!remote_list){  // Read from file
    		const reader = new FileReader();
    	    reader.onload = (e) => {
    	    	file_contents = e.target.result;
                try {
        	    	file_contents_obj = JSON.parse(file_contents)
                } catch (e) {
                    showMessage("Could not parse Trigger Word List", false)
                    return
                }
                importList(file_contents_obj, overwrite)
    		}
    		reader.readAsText(file);
        } else {            // Read from URL
            fetch(fileUrl)
              .then((response) => response.json())
              .then((data) => {
                file_contents_obj = data
                importList(file_contents_obj, overwrite)         
            })
              .catch((error) => {
                showMessage("URL could not be reached or did not contain Trigger Word List", false)
            });
        }
    });

    formExportElm.on('submit', (event) => {
        event.preventDefault()
        const self = this;
        obfuscated = listExportObfuscateElm.checked
        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let triggers = result.triggers;

                // If the file is needed obfuscated
                // Turn all keys to Base64
                if (obfuscated){
                    triggers_obf = {}
                    for (let trigger_entry in triggers){
                        triggers_obf[btoa(trigger_entry)] = triggers[trigger_entry]
                    }
                    triggers = triggers_obf
                }

                download_obj = {
                    'meta': {
                        'name': listNameElm.val().trim(),
                        'author': listAuthorElm.val().trim(),
                        'obfuscated': obfuscated,
                        'version': WebExtVersion
                    },
                    'triggers': {...triggers}
                }

                console.log(download_obj)
                download(listNameElm.val().trim()+".triggers.json", JSON.stringify(download_obj, null, 1))
                showMessage("List exported successfully!", true)
            });
    });

});
