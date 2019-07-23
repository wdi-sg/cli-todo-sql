console.log("works!!", process.argv[2]);

var commandType = process.argv[2];
var value = process.argv[3];

console.log(value);

const pg = require('pg');

const configs = {
    user: 'fishie',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


// ==================================
// Check if call back is successful
// ==================================
let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
};



// ============================================
// Upon connection to database, do the follow
// ============================================
let clientConnectionCallback = (err) => {

    if( err ){
        console.log( "error", err.message );
    }

    let text;
    let now = new Date();
    let year = now.getFullYear();
    let mth = now.getMonth() + 1;
    let date = now.getDate();
    let currDate  = `${year}-${mth}-${date}`;
    let values = [];

    switch(commandType) {
        case 'show':
            // show all task
            // Run command line ---> node index.js show
            text = 'SELECT * FROM items ORDER BY id ASC';
            client.query(text, queryDoneCallback);
            break;
        case 'add':
            // add new task
            // Run command line ---> node index.js add "walk dog"
            text = `INSERT INTO items (task, complete, created_at) VALUES ($1, $2, $3) RETURNING id`;
            values = [value, false , currDate];
            client.query(text, values, queryDoneCallback);
            break;
        case 'done':
            // mark task done
            // Run command line ---> node index.js done 4
            text = `UPDATE items SET complete=$1, updated_at=$2 WHERE id =$3`;
            values = [true, currDate, value];
            client.query(text, values, queryDoneCallback);
            break;
         case 'delete':
            // delete task
            // Run command line ---> node index.js delete 4
            text = `DELETE from items WHERE id ='${value}'`;
            client.query(text, queryDoneCallback);
            break;
        default:
            showInstructions();
    }
};


// ============================================
// Write callback
// ============================================
client.connect(clientConnectionCallback);


var showInstructions = function() {
    console.log("Enter the following command to perform your desired task");
    console.log('1. show - To show all items on your to-do-list.');
    console.log('2. add <item> - To add new item to your to-do-list. E.g. add "walk dog"');
    console.log('3. done <item number> - To mark item as done on your to-do-list. E.g. done 2');
    console.log("4. delete <item number> - To delete an item from your to-do-list. E.g. delete 3");
};