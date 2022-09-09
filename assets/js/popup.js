// $(document).ready(() => {
//     const listElement = $('#alarmsList');
    
//     browser.storage.sync.get(['alarms'])
//         .then((result) => {
//             if (result.hasOwnProperty('alarms') && result.alarms) {
//                 //get current time
//                 const minutes = (new Date).getMinutes().toString().padStart(2, '0');
//                 const hours = (new Date).getHours().toString().padStart(2, '0');
//                 const now = new Date('1970-01-01T' + hours + ':' + minutes + 'Z').getTime();
//                 //loop over the alarms and display them
//                 result.alarms.forEach((alarm, index) => {
//                     const alarmTime = new Date('1970-01-01T' + alarm.time + 'Z').getTime();
//                     if (alarmTime > now) {
//                         appendItem(alarm.content, alarm.time, index);
//                     }
//                 });
//             } else {
//                 //show no items available
//                 appendItem('No alarms are available');
//             }
//         });

//     $("#optionsLink").on('click', () => {
//         browser.runtime.openOptionsPage();
//     });

//     function appendItem (content, badgeContent = null, id = null) {
//         console.log(id)
//         listElement.append(`
//         <li class="list-group-item d-flex justify-content-between align-items-center alarm-item" ${id !== null ? `id="alarm_${id}"` : ''}>
//             ${content}
//             ${badgeContent ? `
//                 <div>
//                     <span class="badge bg-primary rounded-pill">${badgeContent}</span>
//                     <button class="trash-btn p-0"><img src="assets/images/trash.svg" alt="delete" /></button>
//                 </div>
//             ` : ''}
//         </li>
//         `);
//     }

//     $('body').on('click', '.trash-btn', function () {
//         const parent = $(this).parents('.alarm-item');
//         const parentId = parent.attr('id');
//         const alarmIndex = parentId.split('_')[1];

//         //get alarms from storage
//         browser.storage.sync.get(['alarms'])
//             .then((result) => {
//                 let alarms = [];
//                 let alarmName = "";
//                 if (result.alarms && result.alarms.length > alarmIndex) {
//                     alarmName = result.alarms[alarmIndex].alarmName;
//                     result.alarms.splice(alarmIndex, 1);
//                 }
//                 browser.storage.sync.set({alarms})
//                     .then(() => {
//                         //remove alarm by name
//                         browser.alarms.clear(alarmName);
//                         //remove alarm item from list
//                         parent.remove();
//                     });
//             });
//     });
// });