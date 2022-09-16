$(document).ready(() => {

    const listElement = $('#triggerList');
    updateTriggerTable()

    function updateTriggerTable(){
        getWebExtTriggers()
            .then((result) => {
                for (let trigger_word in result){
                    trigger_word_obj = result[trigger_word]
                    appendTriggerWord(trigger_word, trigger_word_obj)
                }
        });
    }

    function appendTriggerWord(trigger_word, trigger_word_obj){
        listElement.append(`
        <tr class="list-group-item d-flex justify-content-between align-items-center">
            <td class="trigger-word" style="width:20%">
                ${trigger_word}
            </td>            
            <td>
                <a class="delete align-items-center" href="#" id="">
                    <img src="assets/images/trash.svg" alt="delete" />
                </a>
            </td>

        </tr>`)
    }
/*
            <td>
                <a class="reveal align-items-center" href="#" id="" align="left">
                    <img src="assets/images/eye.png" alt="reveal" width="5%"/>
                </a>
            </td>
*/


    // function appendItem (content, badgeContent = null, id = null) {
    //     console.log(id)
    //     listElement.append(`
    //     <li class="list-group-item d-flex justify-content-between align-items-center alarm-item" ${id !== null ? `id="alarm_${id}"` : ''}>
    //         ${content}
    //         ${badgeContent ? `
    //             <div>
    //                 <span class="badge bg-primary rounded-pill">${badgeContent}</span>
    //                 <button class="trash-btn p-0"><img src="assets/images/trash.svg" alt="delete" /></button>
    //             </div>
    //         ` : ''}
    //     </li>
    //     `);
    // }

});