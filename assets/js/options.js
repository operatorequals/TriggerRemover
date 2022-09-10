function showSuccess(message){
	// Show success
    let successElm = document.createElement("div")
    successElm.innerHTML = message
    successElm.setAttribute("class", "alert alert-success")
    document.body.appendChild(successElm);
    setTimeout(() => {
    	successElm.remove()
    }, 1000)
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
    const fileImportOwriteElm = $('#overwrite_trigger_list')[0];

    const formExportElm = $('form#export');
    const listNameElm = $('#list_name');
    const listAuthorElm = $('#list_author');
    const listExportObfuscateElm = $('#obfuscate_trigger_list')[0];

    formAddElm.on('submit', () => {
        const self = this;

        //bring triggers from storagetriggers
        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let triggers = result.triggers;
                if (!triggers) {
                    triggers = {};
                }

                triggers[nameElm.val().trim()] = {
                	case_sensitive: caseSensitiveElm.checked,
                	whole_word: wholeWordElm.checked,
                	regex: regexElm.checked,
                }
                console.log(triggers)

                //set triggers in the storage
                browser.storage.sync.set({triggers})
                    .then(() => {
                	    nameElm.val('');
                    	showSuccess("Word added successfully!")
                });
            });
        return false; //disable default form submit action
    });

    formImportElm.on('submit', () => {
	    const self = this;

	    file = fileImportElm.files[0]
		const reader = new FileReader();

	    reader.onload = (e) => {
	    	file_contents = e.target.result;
	    	file_contents_obj = JSON.parse(file_contents)
            meta = file_contents_obj.meta
            // Keys are in Base64 - to not trigger the users
            if (meta.obfuscated){
                triggers = {}
                for (let trigger_entry in file_contents_obj.triggers){
                    triggers[atob(trigger_entry)] = file_contents_obj.triggers[trigger_entry]
                }
            } else {
                triggers = file_contents_obj.triggers
            }
			console.log(triggers)

			if (fileImportOwriteElm.checked) {
				console.log("Overwriting!")
                browser.storage.sync.set({triggers})
                    .then(() => {
                    	showSuccess("List imported successfully!")
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

                        browser.storage.sync.set({triggers})
   			                .then(() => {
                    			showSuccess("List overwritten successfully!")
            		    });
		        });
			}

		} 
		reader.readAsText(file);
    });

    formExportElm.on('submit', () => {
        const self = this;
        obfuscated = listExportObfuscateElm.checked

        browser.storage.sync.get(['triggers'])
            .then((result) => {
                let triggers = result.triggers;

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
                        'obfuscated':obfuscated
                    },
                    'triggers': {...triggers}
                }

                console.log(download_obj)
                download(listNameElm.val().trim()+".triggers.json", JSON.stringify(download_obj, null, 1))
                showSuccess("List exported successfully!")
            });
    });

});