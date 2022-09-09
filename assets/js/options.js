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

$(document).ready(() => {
    const nameElm = $('#word');
    const wholeWordElm = $('#whole-word')[0];
    const caseSensitiveElm = $('#case-sensitive')[0];
    const regexElm = $('#regex')[0];
    const formAddElm = $('form#add');

    const formImportElm = $('form#import');
    const fileImportElm = $('#trigger_list_file')[0];
    const fileImportOwriteElm = $('#overwrite_trigger_list')[0];

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
	    	triggers = JSON.parse(file_contents)
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

});