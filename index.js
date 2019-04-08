console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'ronniechua',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        console.log("result", result.rows);
    }
};

let clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
    }

    // let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

    // const values = ["hello"];

    // client.query(text, values, queryDoneCallback);

    if (process.argv[2] === "show") {

        let queryText = 'SELECT * FROM items';

        client.query(queryText, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                // iterate through all of your results:
                //checks for whether the task is done
                for (let i = 0; i < res.rows.length; i++) {
                    let donePrint = "[ ] - ";
                    if (res.rows[i].done === 1) {
                        donePrint = "[x] - "
                    }

                    console.log(res.rows[i].id + ". " + donePrint + res.rows[i].name);
                }

            }
        });
    }


    if (process.argv[2] === "add") {

        let queryText = 'INSERT INTO items (name) VALUES ($1) RETURNING id';

        let values = [process.argv[3]];

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("Successfully added new task!");
            }
        });

    };

    if (process.argv[2] === "done") {
        const markNo = process.argv[3];

        let queryText = 'INSERT INTO items (done) VALUES ($1) RETURNING id';

        client.query(queryText, values, (err, res) => {
            if (err) {
                console.log("query error", err.message);
            } else {
                console.log("Successfully added new task!");
            }
        });
    };


}


client.connect(clientConnectionCallback);


/* Old code for reference
console.log("works!!", process.argv[2]);
var commandType = process.argv[2];
console.log("Your command was: " + commandType);
const jsonfile = require('jsonfile');
const file = 'data.json'
var array1 = [];
var arrayjoin = array1.join();

jsonfile.readFile(file, (err, obj) => {
    if (process.argv[2] === "add") {
        obj["todoItems"] = [];
        for (var i = 3; i < process.argv.length; i++) {
            obj.todoItems.push(process.argv[i]);
        };

        jsonfile.writeFile(file, obj, (err) => {
            console.log(err)

        });
    } else if (process.argv[2] === "show") {
        console.log(err);
        for (let j = 0; j < obj.todoItems.length; j++) {
            console.log(j + 1 + ". [ ] - " + obj.todoItems[j]);
        };
    }
});
*/