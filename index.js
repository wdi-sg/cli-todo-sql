#!/usr/bin/env node
const pg = require('pg');

const configs = {
    user: 'kach92',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: "Kenny Ang"
};

const client = new pg.Client(configs);


//open connect to database, check process.argv[2]
client.connect((err) => {

    if (err) {
        console.log("error", err.message);
    } else {

        switch (process.argv[2]) {
            case undefined:
                home();
                break;
            case "add":
                add(process.argv[3]);
                break;
            case "show":
                show();
                break;
            case "done":
                done(process.argv[3]);
                break;
            case "delete":
                del(process.argv[3]);
                break;
        }


    }

});

//HOME
const home = function() {
    console.log(`
___________              ________           .____    .__          __
\\__    ___/___           \\______ \\   ____   |    |   |__| _______/  |_
  |    | /  _ \\   ______  |    |  \\ /  _ \\  |    |   |  |/  ___/\\   __\\
  |    |(  <_> ) /_____/  |    \`   (  <_> ) |    |___|  |\\___ \\  |  |
  |____| \\____/          /_______  /\\____/  |_______ \\__/____  > |__|
                                 \\/                 \\/       \\/

        Use the following commands to do its stuff:

        1. add [value]
        2. show
        3. done [num]
        4. delete [num]
        `);
    process.exit();

}

//Add item
const add = function(value) {

    let queryText = "INSERT INTO items (item, finish) VALUES ($1, $2)";
    let arr = [value, false];
    client.query(queryText, arr, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(`Added into To-Do List`);
            process.exit();
        }
    });
}

//Show item
const show = function() {
    let queryText = 'SELECT * FROM items ORDER BY id ASC';

    client.query(queryText, (err, res) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            // iterate through all of your results:
            for (let i = 0; i < res.rows.length; i++) {
                console.log(listMaker(res.rows[i]));
            }
            process.exit();
        }
    });
}

//mark as done if not yet done, undone if already done
const done = function(num) {
    let id = parseInt(num);
    console.log(id);
    if (isNaN(id)) {
        console.log("Bad Input")
    } else {
        let checkFinish = "SELECT finish FROM items WHERE id =" + id;
        let result = false;
        client.query(checkFinish, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                let updated_time = new Date();
                if (res.rows[0].finish === false) {
                    result = true;
                } else {
                    result = false;
                    updated_time = null;
                }

                let queryText = "UPDATE items SET finish = $1, updated_at = $3 WHERE id = $2";
                let arr = [result, id, updated_time];
                client.query(queryText, arr, (err, res) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        console.log(`Updated`);
                        process.exit();
                    }
                });
            }
        });


    }

}

//Delete item. Will have functions to update the items below it to new ID, and update nextVal of id
const del = function(num) {
    let id = parseInt(num);
    if (isNaN(id)) {
        console.log("Bad Input");
    } else {
        let queryText = 'DELETE FROM items WHERE id = ' + id;

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                //get last Id
                let checkMax = 'SELECT MAX(id) FROM items'

                client.query(checkMax, (err, res) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        //loop through each item below the deleted 1 and minus their id by 1
                        for (let i = id + 1; i < res.rows[0].max + 1; i++) {
                            let alterSeq = 'UPDATE items SET id=$1 WHERE id=$2'
                            let arr = [i-1,i];

                            client.query(alterSeq, arr, (err, res) => {
                                if (err) {
                                    console.log("query error", err.message);
                                } else {
                                    return;
                                }

                            })
                        }

                        //update primary key next val
                        let setLastId = "SELECT setval('items_id_seq', (SELECT MAX(id) FROM items));"
                        client.query(setLastId, (err, res) => {
                                if (err) {
                                    console.log("query error", err.message);
                                } else {
                                    console.log("Delete Done")
                                    process.exit();
                                }

                            })

                    }
                });

            }
        });
    }

}

//use to show the nice list pattern when called
const listMaker = function(obj) {
    let marker = obj.finish ? "x" : " ";
    let formatted_created_date = dateFormatter(obj.created_at);
    let formatted_updated_date = dateFormatter(obj.updated_at);


    if (obj.finish) {
        return `${obj.id}. [${marker}] - ${obj.item} \x1b[33mCreated At: ${formatted_created_date}\x1b[0m \x1b[32mUpdated At: ${formatted_updated_date}\x1b[0m`
    } else {
        return `${obj.id}. [${marker}] - ${obj.item} \x1b[33mCreated At: ${formatted_created_date}\x1b[0m`
    }


}

//format and simplify date
const dateFormatter = function(time) {
    return time === null ? null : time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
}