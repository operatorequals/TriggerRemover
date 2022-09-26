TABLE_ELEMENTS = {}
const CHECKBOX_TYPES = ["whole-word", "case-sensitive", "regex"]
const ID_SPLITTER = '^'

function getWordID(id){
    parts = id.split(ID_SPLITTER)
    if (parts.length <= 1)
        return null
    b64_id = parts[1]
    return b64_id
}

function reveal_toggle(event){
    let target_id = event.target.id
    if (!target_id.startsWith('reveal')) return // Sanity check
    let b64_word = getWordID(target_id)
    let current_value = TABLE_ELEMENTS[b64_word]['word'].value
    TABLE_ELEMENTS[b64_word]['word'].disabled = !TABLE_ELEMENTS[b64_word]['word'].disabled
    if (current_value == b64_word) // already hidden
        TABLE_ELEMENTS[b64_word]['word'].value = uatob(b64_word)
    else
        TABLE_ELEMENTS[b64_word]['word'].value = b64_word
}

async function delete_word(event){
    let target_id = event.target.id
    // if (!target_id.startsWith('delete') && !target_id.startsWith('word')) return // Sanity check
    let b64_word = getWordID(target_id)

    for (let k in TABLE_ELEMENTS[b64_word]){
        TABLE_ELEMENTS[b64_word][k].remove()
    }
    await removeTriggerWord(uatob(b64_word))
}

async function change_word(event){
    let target_id = event.target.id
    if (!target_id.startsWith('word') && !target_id.startsWith('attr')) return // Sanity check
    if (target_id.startsWith('word') && event.keyCode !== 13) return // Only if Enter is pressed

    let b64_word = getWordID(target_id)
    if (b64_word === null)
        return add_word(event)
    previous_word = uatob(b64_word)
    current_word = TABLE_ELEMENTS[b64_word]['word'].value
    if (!current_word) return
    console.log(`[+] Changing '${previous_word}' to '${current_word}`)

    await delete_word(event)
    await add_word(event)
}

async function add_word(event){
    let target_id = event.target.id
    // if (!target_id.startsWith('add') && !target_id.startsWith('word')) return // Sanity check
    let b64_word = getWordID(target_id)

    trigger_word = TABLE_ELEMENTS[b64_word]['word'].value
    console.log(trigger_word)
    if (!trigger_word) return   // If textfield is empty stop here

    trigger_word_obj = {}
    for (let t of CHECKBOX_TYPES){
        toggle_value = TABLE_ELEMENTS[b64_word][t].checked
        console.log(`${trigger_word} : ${b64_word} > ${t} - ${toggle_value}`)
        trigger_word_obj[t] = toggle_value
    }
    await addTriggerWord(trigger_word, trigger_word_obj)
    location.reload() // Trigger redraw of the table
}

$(document).ready(() => {

    const listElement = document.getElementById('triggerList');
    updateTriggerTable()

    function updateTriggerTable(){
        header_row = appendHeader()['row']
        listElement.appendChild(header_row)

        TABLE_ELEMENTS[null] = appendEditableWord()
        new_word_row = TABLE_ELEMENTS[null]['row']
        listElement.appendChild(new_word_row)

        getWebExtTriggers()
            .then((result) => {
                for (let trigger_word in result){
                    trigger_word_obj = result[trigger_word]
                    TABLE_ELEMENTS[ubtoa(trigger_word)] = appendEditableWord(trigger_word, trigger_word_obj)
                    listElement.insertBefore((TABLE_ELEMENTS[ubtoa(trigger_word)]['row']), new_word_row.nextSibling)
                }
            console.log(TABLE_ELEMENTS)
        });
    }

    function appendHeader(){
        elements = {}
        rowElm = document.createElement("tr")
        rowElm.className = "list-group-item d-flex justify-content-between align-items-center header"
        elements['row'] = rowElm

        revealCellElm = document.createElement("th")
        revealCellElm.style = "width: 5%"
        // revealCellElm.innerText = ""

        wordCellElm = document.createElement("th")
        wordCellElm.style = "width: 45%"
        wordCellElm.innerText = "Trigger Word"

        cells = {}
        for (let id of CHECKBOX_TYPES){
            cells[id] = document.createElement("th")
            cells[id].style = "width: 5%"
            cells[id].innerText = id
        }

        submitCellElm = document.createElement("td")
        submitCellElm.style = "width: 5%"

        rowElm.appendChild(revealCellElm)
        rowElm.appendChild(wordCellElm)
        rowElm.appendChild(cells["whole-word"])
        rowElm.appendChild(cells["case-sensitive"])
        rowElm.appendChild(cells["regex"])
        rowElm.appendChild(submitCellElm)

        element = rowElm
        // listElement.appendChild(element)
        return elements
    }

    function appendEditableWord(trigger_word, trigger_word_obj){
        id_suffix = ""
        if (trigger_word !== undefined)
            id_suffix = `${ID_SPLITTER}${ubtoa(trigger_word)}`
        else
            trigger_word = ""

        if (trigger_word_obj === undefined){
            trigger_word_obj = {}
            for (let i of CHECKBOX_TYPES)
                trigger_word_obj[i] = false
        }
        elements = {}
        rowElm = document.createElement("tr")
        rowElm.className = "list-group-item d-flex justify-content-between align-items-center"
        elements['row'] = rowElm

        revealCellElm = document.createElement("td")
        revealCellElm.style = "width: 5%"
        if (trigger_word !== ""){   // If it is a new word field
            revealAncElm = document.createElement("a")
            revealAncElm.href = "#"
            revealAncElm.onclick = reveal_toggle
            revealElm = document.createElement("img")
            revealElm.src = "assets/images/eye.svg"
            revealElm.id = "reveal" + id_suffix
            revealElm.src.alt = "reveal"
            revealAncElm.appendChild(revealElm)
            revealCellElm.appendChild(revealAncElm)
            elements['reveal'] = revealElm
        }

        wordCellElm = document.createElement("td")
        wordCellElm.style = "width: 50%"
        wordInputElm = document.createElement("input")
        wordInputElm.type = "text"
        wordInputElm.className = "form-control"
        wordInputElm.id = "word" + id_suffix
        wordInputElm.placeholder = "last time you type it"
        wordInputElm.value = trigger_word // obfuscate the word
        if (trigger_word)
            wordInputElm.disabled = false
        wordInputElm.onkeypress = change_word
        wordCellElm.appendChild(wordInputElm)
        elements['word'] = wordInputElm

        cells = {}
        for (let id of CHECKBOX_TYPES){
            cells[id] = document.createElement("td")
            cells[id].style = "width: 5%"
            input = document.createElement("input")
            input.type = "checkbox"
            input.id = "attr-" + id + id_suffix
            input.checked = trigger_word_obj[id]
            input.onchange = change_word
            cells[id].appendChild(input)
            elements[id] = input
        }

        submitCellElm = document.createElement("td")
        submitCellElm.style = "width: 5%"

        if (trigger_word === ""){   // If it is a new word field
            submitAncElm = document.createElement("a")
            submitAncElm.href = "#"
            submitAncElm.onclick = add_word
            submitElm = document.createElement("img")
            submitElm.src = "assets/images/tick.svg"
            submitElm.style = "align: center; inline-block;"
            submitElm.alt = "add"
            submitElm.id = "add" + id_suffix
            submitAncElm.appendChild(submitElm)
            submitCellElm.appendChild(submitAncElm)
            elements['add'] = submitElm
        } else {
            deleteAncElm = document.createElement("a")
            deleteAncElm.href = "#"
            deleteAncElm.onclick = delete_word
            deleteElm = document.createElement("img")
            deleteElm.src = "assets/images/trash.svg"
            deleteElm.id = "delete" + id_suffix
            deleteElm.alt = "delete"
            deleteAncElm.appendChild(deleteElm)
            submitCellElm.appendChild(deleteAncElm)
            elements['delete'] = deleteElm
        }

        rowElm.appendChild(revealCellElm)
        rowElm.appendChild(wordCellElm)
        rowElm.appendChild(cells["whole-word"])
        rowElm.appendChild(cells["case-sensitive"])
        rowElm.appendChild(cells["regex"])
        rowElm.appendChild(submitCellElm)

        element = rowElm
        listElement.appendChild(element)
        return elements
    }
});
