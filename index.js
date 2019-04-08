// /console.log("works!!", process.argv);

const pg = require('pg');

const configs = {
    user: 'postgres',
    password: 'postgres',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

if (process.argv[2] === "add") {
    const onConnectServer = (err) => {

        if (err) {
            console.log("error", err.message);

        } else {
            let queryText = 'INSERT INTO items (name, done, updated_at) VALUES ($1, $2, $3) RETURNING id';
            const values = [process.argv[3], false, null];

            client.query(queryText, values);
            console.log("Add item - Successful")
        }

    }  // end of onConnectServer

    client.connect(onConnectServer);

} else if (process.argv[2] === "show") {
    let myName = ` +-+-+-+-+-+-+-+ +-+-+ +-+-+ +-+-+-+-+\n |h|e|r|d|a|'|s| |t|o| |d|o| |l|i|s|t|\n +-+-+-+-+-+-+-+ +-+-+ +-+-+ +-+-+-+-+ \n`
    console.log(myName);
    const onConnectServer = (err) => {
        if (err) {
            console.log("error", err.message);

        } else {
            let queryText = 'SELECT * FROM items ORDER BY id ASC';

            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);

                } else {
                    //console.log(res);
                    // iterate through all of your results
                    let doneOutput;
                    let updatedAtOutput;
                    for (let i = 0; i < res.rows.length; i++) {
                        let id = res.rows[i].id;
                        let done = res.rows[i].done;

                        if (done === false) {
                            doneOutput = "[ ]";
                            updatedAtOutput = "NA";
                        } else if (done === true) {
                            doneOutput = "[x]";
                            updatedAtOutput = res.rows[i].updated_at;
                        }

                        console.log(`${id}. ${doneOutput} - ${res.rows[i].name}\nCreated at: ${res.rows[i].created_at}\nUpdated at: ${updatedAtOutput}\n`)
                    }
                }
            })  // end of client query

        }
    }  // end of onConnectServer
    client.connect(onConnectServer);

} else if (process.argv[2] === "done") {
    const onConnectServer = (err) => {
        if (err) {
            console.log("error", err.message);

        } else {
            var d = new Date();
            let queryText = "UPDATE items SET done = 'true', updated_at = '" + d + "' WHERE id = '" +process.argv[3] + "'";

            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("Task Updated");
                }
            });  // end of client query

        }
    }  // end of connect server
    client.connect(onConnectServer);

} else if (process.argv[2] === "delete") {
    const onConnectServer = (err) => {
        if (err) {
            console.log("error", err.message);

        } else {
            let queryText = "DELETE FROM items WHERE id = '" +process.argv[3] + "'";

            //  delete column id and add again so it restart to 1
            let dropId = 'ALTER TABLE items DROP id';
            let addId = 'ALTER TABLE items ADD id SERIAL PRIMARY KEY';

/*            client.query(queryText, (err, res) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    console.log("Item Deleted");
                }
            }) // end of client query*/

            client.query(queryText);
            client.query(dropId);
            client.query(addId);
            console.log("Item Deleted");
        }
    }  // end of onConnectServer
    client.connect(onConnectServer);
}