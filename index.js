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

//=================SHOW ITEMS=====================//

if (process.argv[2] === "show") {

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

        let text = "SELECT item, done, id FROM todoItems";

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