
$(document).ready(() => {
	toggleBtn = document.getElementById("toggle-icon")
	optionsLink = document.getElementById("optionsLink")

    exposureLabelMessage = document.getElementById("exposure_label")
    exposureLabelRatio = document.getElementById("exposure_ratio")
    exposureSlider = document.getElementById("exposure_slider")

    drawExtensionEnabled()
    drawExposureLevel()

    $("#optionsLink").on('click', () => {
        browser.runtime.openOptionsPage();
    });

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
                exposureLabelRatio.innerText = value
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