const pg = require('pg');

const configs = {
  user: 'Chris',
  host: '127.0.0.1',
  database: 'todo',
  port: 5432,
};

const client = new pg.Client(configs);


var add = function (newItem) {
    const onQueryFinished = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            for( let i=0; i<result.rows.length; i++ ){
                console.log("result: ", result.rows[i]);
            }
        }
    };
    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let queryText = 'INSERT INTO items (done, activity) VALUES ($1, $2) RETURNING id';
        const values = ["undone", newItem];

        client.query(queryText, values,  onQueryFinished);

    };

    client.connect(onConnectServer);
}

var show = function () {
    const onQueryFinished = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
         //   console.log(result)
            for( let i=0; i<result.rows.length; i++ ){
                if ( result.rows[i].done == "undone") {
                    console.log( result.rows[i].id + ". [ ] - " + result.rows[i].activity );
                } else if ( result.rows[i].done == "done") {
                    console.log( result.rows[i].id + ". [x] - " + result.rows[i].activity );
                }
            }
        }
    };
    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }

        let queryText = 'SELECT * FROM items ORDER BY id';

        client.query(queryText, onQueryFinished);

    };

    client.connect(onConnectServer);

}

var done = function (itemNum) {

    const onQueryFinished = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            for( let i=0; i<result.rows.length; i++ ){
                console.log("result: ", result.rows[i]);
            }
        }
    };
    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }
        // const now = ;
        let queryText = "UPDATE items SET done='done', updated_at='NOW' WHERE id = '"+itemNum+"';";

        client.query(queryText, onQueryFinished);

    };

    client.connect(onConnectServer);

}

var del = function (itemNum) {

    const onQueryFinished = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            for( let i=0; i<result.rows.length; i++ ){
                console.log("deleted: ", itemNum + " from the list");
            }
        }
    };
    const onConnectServer = (err) => {

        if( err ){
            console.log( "error", err.message );
        }
        // const now = ;
        let queryText = "DELETE FROM items WHERE id='"+itemNum+"';";

        client.query(queryText, onQueryFinished);

    };

    client.connect(onConnectServer);

}

const calledFunction = process.argv[2];
const userInput = process.argv[3];

if (calledFunction == "add") {
    add(userInput);
    // console.log(obj["toDoItems"]);
} else if (calledFunction == "show") {
    show();
} else if (calledFunction == "done") {
    done(userInput);
} else if (calledFunction == "delete") {
    del(userInput);
}