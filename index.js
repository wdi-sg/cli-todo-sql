const pg = require('pg');
const Table = require('ascii-art-table');
const AsciiTable = require('ascii-table');

// console.log("works!!", process.argv[2]);

const configs = {
    user: 'stuartmyers',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

const commandType = process.argv[2];
const commandArg = process.argv[3];

////////////////////////
// *** FUNCTIONS! *** //
////////////////////////

// When the query is done what does the DB tell me?
let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
        client.end();
    } else {
        // console.log("Done!", result.rows);
        if (result.rows[0] && !result.rows[0].archived) {
            let markedAsDone = result.rows[0].isdone ? "X" : " ";
            const dateCreated = new Date(result.rows[0].datecreated);
            const dateUpdated = new Date(result.rows[0].dateupdated);
            console.log(`${result.rows[0].id}. [${markedAsDone}] - ${result.rows[0].name} - Created: ${dateCreated.getDate()}-${dateCreated.getMonth()+1}-${dateCreated.getFullYear()} - Updated: ${dateUpdated.getDate()}-${dateUpdated.getMonth()+1}-${dateUpdated.getFullYear()}`);
        }
        console.log('****************************************')
        listToDoListItems();
    }
};

// Archive an ID (not delete)
const archiveItem = (idNo) => {
    const inputNo = parseInt(idNo);
    // TODO: TEST IF The index exists in the DB.
    if (isNaN(idNo)) {
        console.log('Error please put in a valid number');
        return;
    }
    let text = "UPDATE items SET archived=$1, dateupdated=$2 WHERE id=$3 RETURNING *"
    const date = new Date();
    const values = [true, date, inputNo];
    client.query(text, values, queryDoneCallback);
}

// List the items.
const listToDoListItems = () => {
    let listText = "SELECT * FROM items ORDER BY id";
    client.query(listText, (err, result) => {
        let displayTable = new AsciiTable('TO-DO LIST');
        displayTable.setHeading('No.', 'Done', 'Item', 'Date Created', 'Date Updated')
        displayTable.setAlign(1, AsciiTable.CENTER);
        for (let i = 0; i < result.rows.length; i++) {
            if (result.rows[i].archived) {continue};
            let markedAsDone = result.rows[i].isdone ? "X" : " ";
            const dateCreated = new Date(result.rows[i].datecreated);
            const dateCreatedString = `${dateCreated.getDate().toString().padStart(2,'0')}-${(dateCreated.getMonth()+1).toString().padStart(2,'0')}-${dateCreated.getFullYear()}`;
            const dateUpdated = new Date(result.rows[i].dateupdated);
            const dateUpdatedString = `${(dateUpdated.getDate()).toString().padStart(2,'0')}-${(dateUpdated.getMonth()+1).toString().padStart(2,'0')}-${dateUpdated.getFullYear()}`;
            // console.log(`${result.rows[i].id}. [${markedAsDone}] - ${result.rows[i].name} - Created: ${dateCreated.getDate()}-${dateCreated.getMonth()+1}-${dateCreated.getFullYear()} - Updated: ${dateUpdated.getDate()}-${dateUpdated.getMonth()+1}-${dateUpdated.getFullYear()}`);
            displayTable.addRow(result.rows[i].id, markedAsDone, result.rows[i].name, dateCreatedString, dateUpdatedString);
        }
        console.log(displayTable.toString());
        client.end();
    })

}

// Delete an item at index.
const deleteItem = (inputNo) => {
    inputNo = parseInt(inputNo);
    if (isNaN(inputNo)) {
        console.log('Error please put in a valid number');
        return;
    }
    let deleteText = "DELETE FROM items WHERE id=$1";
    const values = [inputNo];
    client.query(deleteText, values, queryDoneCallback);
}


// Mark item as done.
const markedDone = (idNo) => {
    const inputNo = parseInt(idNo);

    // TODO: TEST IF The index exists in the DB.

    if (isNaN(idNo)) {
        console.log('Error please put in a valid number');
        return;
    }
    let text = "UPDATE items SET isdone=$1, dateupdated=$2 WHERE id=$3 RETURNING *"
    const date = new Date();
    const values = [true, date, inputNo];
    client.query(text, values, queryDoneCallback);
}


// Add a to do list item!
const addToDoListItem = (inputArg) => {
    console.log('adding' + inputArg);
    let text = "INSERT INTO items (name, isdone, datecreated, dateupdated) VALUES ($1, $2, $3, $4) RETURNING *"
    const values = [inputArg, false, new Date(), new Date()];
    client.query(text, values, queryDoneCallback)
}

// Client connection call back.
let clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
        client.end();
    }

    if (process.argv[2]) {
        whatCommand();
    } else {
        listToDoListItems();
        // let text = "SELECT * FROM items";
        //
        // client.query(text, queryDoneCallback);
    }
};

// Parse argument to see what command to do. By default just give an error and list the to-do items.
const whatCommand = () => {
    switch (commandType) {
        case 'add':
            addToDoListItem(commandArg);
            break;
        case 'show':
            listToDoListItems();
            break;
        case 'display':
            listToDoListItems();
            break;
        case 'done':
            markedDone(commandArg);
            break;
        case 'complete':
            markedDone(commandArg);
            break;
        case 'delete':
            deleteItem(commandArg);
            break;
        case 'archive':
            archiveItem(commandArg);
            break;
        default:
            console.log('Not a valid command');
            break;
    }
}



client.connect(clientConnectionCallback);
