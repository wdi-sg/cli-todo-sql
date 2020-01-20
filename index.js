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
        listItems();
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
    let text = "UPDATE items SET archived=NOT archived, dateupdated=$1 WHERE id=$2 RETURNING *"
    const date = new Date();
    const values = [date, inputNo];
    client.query(text, values, queryDoneCallback);
}


// List the items.
const listItems = () => {
    let listText = "SELECT * FROM items ORDER BY id";
    client.query(listText, (error, result) => {
        if (error) {
          console.log('Error!', error);
          client.end();
        };

        let displayTable = new AsciiTable('TO-DO LIST');
        displayTable.setHeading('No.', 'Done', 'Item', 'Date Created', 'Date Updated')
        displayTable.setAlign(1, AsciiTable.CENTER);

        for (const item of result.rows) {
            if (item.archived) {
                continue
            };
            let markedAsDone = item.isdone ? "X" : " ";
            const dateCreated = new Date(item.datecreated);
            const dateCreatedString = `${dateCreated.getDate().toString().padStart(2,'0')}-${(dateCreated.getMonth()+1).toString().padStart(2,'0')}-${dateCreated.getFullYear()}`;
            const dateUpdated = new Date(item.dateupdated);
            const dateUpdatedString = `${(dateUpdated.getDate()).toString().padStart(2,'0')}-${(dateUpdated.getMonth()+1).toString().padStart(2,'0')}-${dateUpdated.getFullYear()}`;
            displayTable.addRow(item.id, markedAsDone, item.name, dateCreatedString, dateUpdatedString);
        }
        console.log(displayTable.toString());
        client.end();
    })

}


// Parser for the different statistics functions.
const displayStatistics = (inputArg) => {
  switch (inputArg) {
    case 'complete-time':
      displayAvgCompletionTime();
      break;
    default:
    console.log('Not a valid statistic to show.');
    break;
  }
}


// node todo.js stats complete-time give the average completion time of all items
const displayAvgCompletionTime = () => {
  const queryString = "SELECT * FROM items ORDER BY id";
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
    let text = "UPDATE items SET isdone = NOT isdone, dateupdated=$1 WHERE id=$2 RETURNING *"
    const date = new Date();
    const values = [date, inputNo];
    client.query(text, values, queryDoneCallback);
}


// Add a to do list item!
const addToDoListItem = (inputArg) => {
    console.log('adding' + inputArg);
    let text = "INSERT INTO items (name, isdone, datecreated, dateupdated, archived) VALUES ($1, $2, $3, $4, $5) RETURNING *"
    const values = [inputArg, false, new Date(), new Date(), false];
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
        listItems();
    }
};

// Parse argument to see what command to do. By default just give an error and list the to-do items.
const whatCommand = () => {
    switch (commandType) {
        case 'add':
            addToDoListItem(commandArg);
            break;
        case 'show':
            listItems();
            break;
        case 'display':
            listItems();
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
        case 'stats':
            displayStatistics(commandArg);
            break;
        default:
            console.log('Not a valid command');
            break;
    }
}



client.connect(clientConnectionCallback);
