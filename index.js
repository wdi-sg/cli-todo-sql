
const commandType = process.argv[2];
const userInput = process.argv[3];
const userInput1 = process.argv[4];

console.log("works!!", process.argv[2]);

const pg = require('pg');
const figlet = require('figlet');

const configs = {
    user: 'neelaugusthy',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

var setMessage = function (content) {
    figlet(content, function (err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data);

        console.log('Options');
        console.log('1. View Items: Enter "node index.js show" to view all the items');
        console.log('2. Add new item: Enter "node index.js add {name}, {date_due}" to add new items');
        console.log('3. Mark item done: Enter "node index.js done {id}" to mark item done');
        console.log('4. Delete item: Enter "node index.js delete {id}" to delete the item');
    });
}

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};

let clientConnectionCallback = (err) => {

    if( err ){
        console.log( "Something Went Wrong!", err.message );
    }

    if (commandType === "add") {
        let text = "INSERT INTO items (name, date_due) VALUES ($1,$2) RETURNING *";

        const values = [userInput, userInput1]

        client.query(text, values, queryDoneCallback);
    }

    if (commandType === "show") {
            let text = "SELECT * FROM items ORDER BY id";
            client.query(text, queryDoneCallback);
    }

    if (commandType === "done") {
            let text = "UPDATE items SET status = 'x' WHERE id=$1 RETURNING *"
            const values = [userInput];

            client.query(text, values, queryDoneCallback);

    }

    if(commandType === "undone") {

            let text= "UPDATE items SET status='' WHERE id=$1 RETURNING *";

            const values= [userInput];

            client.query(text, values, queryDoneCallback);

        }


    if(commandType === "delete") {

            let text = "DELETE from items WHERE id=$1 RETURNING *";

            const values =[userInput];

            client.query(text, values, queryDoneCallback);
        }

        if(commandType === undefined) {
            setMessage("Neel's - To-Do List");
        }

};

client.connect(clientConnectionCallback);