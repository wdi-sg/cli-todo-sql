
const pg = require('pg');

const configs = {
    user: 'ben',
    host: '127.0.0.1',
    port: 5432,
    database: 'todolist',
};

const client = new pg.Client(configs);

const displayArray = [ 'Add To Do', 'Display To Do', 'Done'];
const commandType = parseInt( process.argv[ 2 ] );
const parameter = process.argv[ 3 ];
let textPg = "";

let loadDisplay = function() {
    let menu = "";
    for ( let i = 0; i < displayArray.length; i++ ) {
        menu += `(${i+1}) ${displayArray[i]} \n`;
    }
    console.log( menu );
    console.log( Date() );
}

let addToDo = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    let text = `INSERT INTO items (name) VALUES ('${parameter}')`;

    client.query(text, (err, res) => {
        if (err) {
            console.log("input error", err.message);
        } else {
            console.log("To Do Added");
        }
        client.end();
    });
}

let printToDo = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    const text = 'SELECT * FROM items ORDER BY id ASC';
    console.log("Show All To Do");
    console.log("--------------");
    client.query(text, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            for (let i = 0; i < res.rows.length; i++) {
                let check = res.rows[i]["completed"] ? "X" : " ";
                console.log(`${res.rows[i]["id"]}. [${check}] - ${res.rows[i]["name"]}`);
            }
        }
        client.end();
    });
}

let markToDo = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    let text = `UPDATE items SET completed=true WHERE id=${parameter}`;

    client.query(text, (err, res) => {
        if (err) {
            console.log("input error", err.message);
        } else {
            console.log(`Task id:${parameter} Done!`);
        }
        client.end();
    });
}

if ( commandType <= displayArray.length ) {
    console.log( "Echo command: " + displayArray[ commandType - 1 ] );
    if ( commandType === 1 && parameter ) {
        client.connect(addToDo);
    } else if ( commandType === 2 ) {
        client.connect(printToDo);
    } else if ( commandType === 3 ) {
        client.connect(markToDo);
    }
} else {
    loadDisplay();
}