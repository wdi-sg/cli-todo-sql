const pg = require('pg');
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
    if (isNaN(idNo)) {
        console.log('Error please put in a valid number');
        client.end();
        return;
    }
    // TEST IF The index exists in the DB.
    let testIndexText = "SELECT * FROM items WHERE id=$1";
    const testIndexValues = [inputNo]
    client.query(testIndexText, testIndexValues, (err, result) => {
        if (result.rows.length) {
            let text = "UPDATE items SET archived=NOT archived, dateupdated=$1 WHERE id=$2 RETURNING *"
            const date = new Date();
            const values = [date, inputNo];
            client.query(text, values, queryDoneCallback);
        } else {
            console.log(`ERROR! ERROR! ERROR!`);
            console.log(`Item ID No. ${idNo} does not exist in the database.`);
            client.end();
        }
    })
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
    const queryString = "SELECT * FROM items WHERE isdone = true";
    client.query(queryString, (err, result) => {
      if (result.rows.length) {
        let timeToCompletion = 0;
        for (const item of result.rows) {
          let dateCreated = item.datecreated;
          if (!dateCreated) { continue };
          dateCreated = dateCreated.getTime();
          let dateUpdated = item.dateupdated;
          if (!dateUpdated) { continue };
          dateUpdated = dateUpdated.getTime();
          timeToCompletion += Math.abs(dateUpdated - dateCreated);
        }
        timeToCompletion = (timeToCompletion/result.rows.length);
        console.log(`It has on average taken ${timeToCompletion} ms between making a task and completing it.`);
        console.log(`The requirements didn't state it had to be a useful unit of measurement.`);
        client.end();
      } else {
        console.log(`No tasks have been completed`);
        client.end();
      }
    })
}


// Delete an item at index.
const deleteItem = (idNo) => {
    const inputNo = parseInt(idNo);
    if (isNaN(idNo)) {
        console.log('Error please put in a valid number');
        client.end();
        return;
    }
    // TEST IF The index exists in the DB.
    let testIndexText = "SELECT * FROM items WHERE id=$1";
    const testIndexValues = [inputNo];
    client.query(testIndexText, testIndexValues, (err, result) => {
        if (result.rows.length) {
            inputNo = parseInt(inputNo);
            let deleteText = "DELETE FROM items WHERE id=$1";
            const values = [inputNo];
            client.query(deleteText, values, queryDoneCallback);
        } else {
            console.log(`ERROR! ERROR! ERROR!`);
            console.log(`Item ID No. ${idNo} does not exist in the database.`);
            client.end();
        }
    })
}


// Mark item as done.
const markedDone = (idNo) => {
    // TEST IF The index exists in the DB.
    let testIndexText = "SELECT * FROM items WHERE id=$1";
    const testIndexValues = [idNo]
    if (isNaN(idNo)) {
        console.log('Error please put in a valid number');
        client.end();
        return;
    };
    const inputNo = parseInt(idNo);
    client.query(testIndexText, testIndexValues, (err, result) => {
        if (result.rows.length) {
            let text = "UPDATE items SET isdone = NOT isdone, dateupdated=$1 WHERE id=$2 RETURNING *"
            const date = new Date();
            const values = [date, inputNo];
            client.query(text, values, queryDoneCallback);
        } else {
            console.log(`ERROR! ERROR! ERROR!`);
            console.log(`Item ID No. ${idNo} does not exist in the database.`);
            client.end();
        }
    })
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
