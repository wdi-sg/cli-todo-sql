console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'kwansing',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let clientConnectionCallback = (err) => {


    //if input equals add
    //===================
    if(process.argv[2] == "add") {

        const values = ["[ ] - ",process.argv[3]];

        if( err ){
            console.log( "error", err.message );
        }

        let queryText = "INSERT INTO items (brac, name) VALUES ($1, $2) RETURNING id";

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just created:", res.rows[0].id);
                console.log(values);
            }
        });
    }

    //if input equals done
    //=====================
    if(process.argv[2] == "done") {

        //const values = ["[ ] - "+process.argv[3]];

        if( err ){
            console.log( "error", err.message );
        }

        let values = [process.argv[3]];
        let queryText = "UPDATE items SET brac='[x] -' WHERE id = $1 returning id";

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just selected:", res.rows[0].id);
                console.log(values);
            }
        });
    }

    //if input equals done
    //=====================
    if(process.argv[2] == "delete") {

        //const values = ["[ ] - "+process.argv[3]];

        if( err ){
            console.log( "error", err.message );
        }

        let values = [process.argv[3]];
        console.log(values)
        //let values = [process.argv[3]];
        let queryText = "DELETE FROM items WHERE id = $1 RETURNING id";
        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("id of the thing you just selected:", res.rows[0].id);
                console.log(values);
            }
        });
    }

    //if input equals show
    //====================
    if (process.argv[2] == "show") {

        let queryText = 'SELECT * FROM items';

        client.query(queryText, (err, res) => {
            if (err) {
              console.log("query error", err.message);
            } else {
              // iterate through all of your results:
              for( let i=0; i<res.rows.length; i++ ){
                console.log("result: ", res.rows[i]);
              }
            }
            client.end();
        });
    }


};
client.connect(clientConnectionCallback);