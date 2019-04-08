console.log("~_~", process.argv[2]);

const input = process.argv[3];

const pg = require('pg');

const configs = {
    user: 'valenlyn',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

const art = "           *-*,\n       ,*\\/|`| \\\n       \\'  | |'| *,\n        \\ `| | |/ )\n         | |'| , /\n         |'| |, /\n       __|_|_|_|_\n      [___________]\n       |         |\n       |  VAL'S  |\n       |  TODO   |\n       |  LIST   |\n       |_________|";

//=================SHOW ITEMS=====================//

function show() {

    let boxDisplay = "";
    let array = [];

    const onQueryFinished = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {

          console.log(art);

          for( let i=0; i<result.rows.length; i++ ){

            if (result.rows[i].done === false) {
                boxDisplay = "[ ]";
            } else {
                boxDisplay = "[x]";
            }

            array.push(result.rows[i].id + ". " + boxDisplay + " – " + result.rows[i].item + " " + result.rows[i].created_at);
          }

           array.sort();

            for (let i = 0; i < array.length; i++) {
                console.log(array[i]);
            }

        }
    };

    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let text = "SELECT item, done, id, created_at FROM todoItems";

        client.query(text, onQueryFinished);

    };

    client.connect(onConnectServer);

}

if (process.argv[2] === "show") {
    show();
}

//==================ADD ITEM======================//

if (process.argv[2] === "add") {

    const onQueryFinished = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        }
    };

    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let text = `INSERT INTO todoItems (item, done) VALUES ('${input}', false)`;

        client.query(text, onQueryFinished);

    };

    client.connect(onConnectServer);

}

//============COMPLETE (MARK AS DONE)=============//

if (process.argv[2] === "done") {

    let boxDisplay = "";

    const onQueryFinished = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {

          for( let i=0; i<result.rows.length; i++ ){

            if (result.rows[i].done === false) {
                boxDisplay = "[ ]";
            } else {
                boxDisplay = "[x]";
            }

            console.log(result.rows[i].id + ". " + boxDisplay + " – " + result.rows[i].item);
          }
        }
    };

    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let text = `UPDATE todoItems SET done=true WHERE id=${input}`;

        client.query(text, onQueryFinished);

    };

    client.connect(onConnectServer);

}

//================DELETE ITEM=====================//

if (process.argv[2] === "delete") {

    const onQueryFinished = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        }
    };

    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let text = `DELETE from todoItems WHERE id=${input}`;

        client.query(text, onQueryFinished);

    };

    client.connect(onConnectServer);

}