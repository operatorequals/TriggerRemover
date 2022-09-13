const ExposureLevelMessages = {
    0 :  "Will block <b>ALL</b> found Triggers",
    30:  "<b>Some</b> Triggers here and there",
    70:  "A bit <b>more</b> going on",
    99:  "Closer to the <b>uncensored Internet</b>!",
    100: "You are attending the Internet. <b>Congratulations!</b>",
}

$(document).ready(() => {
	toggleBtn = document.getElementById("toggle-icon")
	optionsLink = document.getElementById("optionsLink")
	optionsLink.href = browser.runtime.getURL("options.html")

    exposureLabelMessage = document.getElementById("exposure_label")
    exposureLabelRatio = document.getElementById("exposure_ratio")
    exposureSlider = document.getElementById("exposure_slider")


    drawExtensionEnabled()
    drawExposureLevel()
    // const listElement = $('#alarmsList');
    
    // browser.storage.sync.get(['alarms'])
    //     .then((result) => {
    //         if (result.hasOwnProperty('alarms') && result.alarms) {
    //             //get current time
    //             const minutes = (new Date).getMinutes().toString().padStart(2, '0');
    //             const hours = (new Date).getHours().toString().padStart(2, '0');
    //             const now = new Date('1970-01-01T' + hours + ':' + minutes + 'Z').getTime();
    //             //loop over the alarms and display them
    //             result.alarms.forEach((alarm, index) => {
    //                 const alarmTime = new Date('1970-01-01T' + alarm.time + 'Z').getTime();
    //                 if (alarmTime > now) {
    //                     appendItem(alarm.content, alarm.time, index);
    //                 }
    //             });
    //         } else {
    //             //show no items available
    //             appendItem('No alarms are available');
    //         }
    //     });

    // $("#optionsLink").on('click', () => {
    //     browser.runtime.openOptionsPage();
    // });

    function appendItem (content, badgeContent = null, id = null) {
        console.log(id)
        listElement.append(`
        <li class="list-group-item d-flex justify-content-between align-items-center alarm-item" ${id !== null ? `id="alarm_${id}"` : ''}>
            ${content}
            ${badgeContent ? `
                <div>
                    <span class="badge bg-primary rounded-pill">${badgeContent}</span>
                    <button class="trash-btn p-0"><img src="assets/images/trash.svg" alt="delete" /></button>
                </div>
            ` : ''}
        </li>
        `);
    }

    function drawExtensionEnabled() {
        getWebExtSettings()
			.then((result) => {
				console.log("Drawing: " + result.enabled)
				if (result.enabled)
		    		toggleBtn.src = "assets/images/switch-on.png"
		    	else
		    		toggleBtn.src = "assets/images/switch-off.png"
		});
	}

    function drawExposureLevel() {
        getWebExtSettings()
            .then((result) => {
                console.log("Drawing: " + result.exposure)
                value = parseInt(result.exposure, 10)
                exposureLabelRatio.innerHTML = value
                exposureSlider.value = value
                for (let val in ExposureLevelMessages){
                    if (value <= val){
                    exposureLabelMessage.innerHTML = ExposureLevelMessages[val]
                    break
                }
        }

        });
    }

    exposureSlider.oninput = function() {
        value = parseInt(this.value, 10)
        setWebExtExposure(value)
        drawExposureLevel()
    }

    $("#toggle").on('click', function () {
    	// Toggle the global
		toggleWebExtEnabled()
			.then(() => {
		    	drawExtensionEnabled()
		});
		// console.log("toggle return "+a)
	});

    $('body').on('click', '.trash-btn', function () {
        const parent = $(this).parents('.alarm-item');
        const parentId = parent.attr('id');
        const alarmIndex = parentId.split('_')[1];

        //get alarms from storage
        browser.storage.sync.get(['alarms'])
            .then((result) => {
                let alarms = [];
                let alarmName = "";
                if (result.alarms && result.alarms.length > alarmIndex) {
                    alarmName = result.alarms[alarmIndex].alarmName;
                    result.alarms.splice(alarmIndex, 1);
                }
                browser.storage.sync.set({alarms})
                    .then(() => {
                        //remove alarm by name
                        browser.alarms.clear(alarmName);
                        //remove alarm item from list
                        parent.remove();
                    });
            });
    });
});