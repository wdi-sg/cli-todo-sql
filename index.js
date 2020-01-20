console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'eunicelok',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let commandType = process.argv[2];
let toDoItem = process.argv[3];
let parseItem = parseInt(toDoItem);


/*****************
┌─┐┬ ┬┌─┐┬ ┬
└─┐├─┤│ ││││
└─┘┴ ┴└─┘└┴┘
*****************/

//this is in a way for you to see what will be log in terminal, can try console.log result to see
const listItem = () => {
    let listText = 'SELECT * FROM items ORDER BY id';
    client.query(listText, (err, result) => {
        if (err) {
            console.log("Error!");
            client.end();
        };
        for (const item of result.rows)
            console.log(item.id + ". [] - " + item.name);
    })
};


/*****************************************************
____ _  _ ____ ____ _   _    ___  ____ _  _ ____
|  | |  | |___ |__/  \_/     |  \ |  | |\ | |___
|_\| |__| |___ |  \   |      |__/ |__| | \| |___

******************************************************/

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
      listItem();
    }
};

/*****************
____ ___  ___
|__| |  \ |  \
|  | |__/ |__/

*****************/

//TO ADD ITEMS INTO TO DO LIST
const addItems = () => {
    if (commandType === "add") {
        let text = 'INSERT INTO items (name) VALUES ($1) RETURNING *';
        const values = [toDoItem];
        client.query(text, values, queryDoneCallback);
    }
    // client.end();
};


/***********************************

___  ____ _  _ ____    _ ___ ____ _  _
|  \ |  | |\ | |___    |  |  |___ |\/|
|__/ |__| | \| |___    |  |  |___ |  |


***********************************/

//DONE ITEM BY MARKING [X]
//add a column to psql for user to update have they do the list
//https://www.postgresqltutorial.com/postgresql-add-column/
//https://www.w3schools.com/sql/sql_update.asp

//to see what has been mark as done for the chosen task in terminal
let doneTask = (err, result) => {
  if (err) {
    console.log("query error", err.message);
  } else {
    //TODO: CONSOLE.LOG LIST OF ALL ITEMS WITH DONE ITEMS BEING MARK WITH X, OTHER'S [] REMAINS EMPTY
    console.log(result); //  rows: [ { id: 18, name: 'run around', isdone: true } ], so have to result.rows[0]~~~~~~~~~~~~~
    console.log(result.rows[0].id + '. [x] - '  + result.rows[0].name);
  }
  client.end();
};

const doneItem = () => {
    if (commandType === "done") {
        let text = 'UPDATE items SET isDone=TRUE WHERE id = ($1) RETURNING *';
        const values = [parseItem];
        client.query(text, values, doneTask);
    }
};



/****************************************************************
___ ____    ___  ____    ____ ____ _  _ _  _ ____ _  _ ___  ____
 |  |  |    |  \ |  |    |    |  | |\/| |\/| |__| |\ | |  \ [__
 |  |__|    |__/ |__|    |___ |__| |  | |  | |  | | \| |__/ ___]

******************************************************************/

//SETTING THE CONDITIONAL TO DO DIFFERENT FUNCTION FOR DIFFERENT COMMANDS
const toDoCommands = () => {
    if (commandType === "add") {
        addItems();
    } else if (commandType === "show") {
        listItem();
    } else if (commandType === "done") {
        doneItem();
    }    else {
        console.log("Not a valid command!!!");
    }
};

/***********************************************
____ ____ _  _ _  _ ____ ____ ___
|    |  | |\ | |\ | |___ |     |
|___ |__| | \| | \| |___ |___  |

************************************************/

let clientConnectionCallback = (err) => {
    if( err ){
    console.log( "error", err.message );
    }
    if (commandType !== " ") {
        toDoCommands();
    } else {
        console.log("You probably should check the commands.");
    }
};


client.connect(clientConnectionCallback);