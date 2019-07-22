//console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'marcykay',
    host: '127.0.0.1',
    port: 5432,
    database: 'todo',
};

const client = new pg.Client(configs);

const menuArr = [ 'Add Task', 'Show All Tasks', 'Mark As Done'];
const commandType = parseInt( process.argv[ 2 ] );
const parameter = process.argv[ 3 ];
let textPg = "";

let loadFrontPage = function() {
    let appTitle = `  ___  __    __    ____  __       ____   __     __    __  ____  ____
 / __)(  )  (  )  (_  _)/  \\  ___(    \\ /  \\   (  )  (  )/ ___)(_  _)
( (__ / (_/\\ )(     )( (  O )(___)) D ((  O )  / (_/\\ )( \\___ \\  )(
 \\___)\\____/(__)   (__) \\__/     (____/ \\__/   \\____/(__)(____/ (__) VERSION POSTGRES\n`;
    let menu = "";
    for ( let i = 0; i < menuArr.length; i++ ) {
        menu += `(${i+1}) ${menuArr[i]} \n`;
    }
    console.log( appTitle );
    console.log( menu );
    console.log( Date() );
}

let addTask = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    let text = `INSERT INTO items (name) VALUES ('${parameter}')`;

    client.query(text, (err, res) => {
        if (err) {
            console.log("input error", err.message);
        } else {
            console.log("Task Added");
        }
        client.end();
    });
}

let printTasks = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    const text = 'SELECT * FROM items ORDER BY id ASC';
    console.log("Show All Tasks");
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

let markTaskDone = (err) => {
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

if ( commandType <= menuArr.length ) {
    console.log( "Echo command: " + menuArr[ commandType - 1 ] );
    if ( commandType === 1 && parameter ) {
        client.connect(addTask);
    } else if ( commandType === 2 ) {
        client.connect(printTasks);
    } else if ( commandType === 3 ) {
        client.connect(markTaskDone);
    }
} else {
    loadFrontPage();
}
