console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'hockie2',
    password: 'bhhorse2',
    host: '127.0.0.1',
    port: 5432,
    database: 'todo',
};

const client = new pg.Client(configs);




//time task added
// let date = new Date(new Date().getFullYear(),new Date().getMonth(), new Date().getDate());
const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
let date = new Date().getDate() + "-" + months[new Date().getMonth()] + "-" + new Date().getFullYear();

///////////////////////////////////////////////////////////////
//ask for input
var userCommand = process.argv[2];
var userTask = process.argv[3];

///////////////////////////////////////////////////////////////
function instructions(){
var instruction = `
      ████████╗ ██████╗     ██████╗  ██████╗     ██╗     ██╗███████╗████████╗
      ╚══██╔══╝██╔═══██╗    ██╔══██╗██╔═══██╗    ██║     ██║██╔════╝╚══██╔══╝
         ██║   ██║   ██║    ██║  ██║██║   ██║    ██║     ██║███████╗   ██║
         ██║   ██║   ██║    ██║  ██║██║   ██║    ██║     ██║╚════██║   ██║
         ██║   ╚██████╔╝    ██████╔╝╚██████╔╝    ███████╗██║███████║   ██║
         ╚═╝    ╚═════╝     ╚═════╝  ╚═════╝     ╚══════╝╚═╝╚══════╝   ╚═╝

Use the following commands for the respective functions.
Use the command "add" followed by your to-do task in "", eg. add "walk the dog"

add - To add a new task to the list.
delete - To delete a task from the list.
show - To show all the tasks
done - To mark a task as done.
`;
console.log(instruction);
// console.log(userCommand);
}

function show(){
    let queryText = `SELECT * FROM items ORDER BY id ASC`;
                client.query(queryText, (err, res) => {
                    if (err) {
                    console.log("query error", err.message);
                    }
                    else{

                        let doneBox;
                        // let updatedAtOutput;

                        for (let i = 0; i < res.rows.length; i++) {
                        let id = res.rows[i].id;
                        let done = res.rows[i].done;

                        if (done === false) {
                            doneBox = "[ ]";
                            // updatedAtOutput = "NA";
                        } else if (done === true) {
                            doneBox = "[x]";
                            // updateField = res.rows[i].updated_at;
                        }
                        console.log(`${id}. ${doneBox} - ${res.rows[i].task}, created at ${res.rows[i].created_at}`)
                        }
                    }
                })
}


///////////////////////////////////////////////////////////////////////////////////////////////////

  switch(userCommand){

        case undefined:
        instructions();
        break;

////////////////////////////////////////////////////////////////////////////
        case 'add':
        client.connect((err) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                let queryText = 'INSERT INTO items (task, done, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING id';
                const values = [userTask, false, date, null];

                client.query(queryText, values);
                console.log(`Added: ${userTask} at ${date}`)

            }
        });
        break;


////////////////////////////////////////////////////////////////////////////
        case 'show':
        client.connect((err) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                show();
            }
        });
        break;

////////////////////////////////////////////////////////////////////////////
        case 'done':
        client.connect((err) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                let queryText=`UPDATE items SET done = $2, updated_at = $3 WHERE id = $1`;
                let values= [`${process.argv[3]}`, true, date];
                client.query(queryText, values, (err, res) => {
                    if (err) {
                    console.log("query error", err.message);
                    }
                    else {
                    console.log("Task Updated");
                    show();
                    }
                })
            }
        });
        break;
////////////////////////////////////////////////////////////////////////////
        case 'undone':
        client.connect((err) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                let queryText=`UPDATE items SET done = 'false' WHERE items.id = '${process.argv[3]}'`;
                client.query(queryText, (err, res) => {
                    if (err) {
                    console.log("query error", err.message);
                    }
                    else {
                    console.log("Task Undone");
                    show();
                    }
                })
            }
        });
        break;
////////////////////////////////////////////////////////////////////////////
        case 'delete':

        client.connect((err) => {
            if (err) {
                console.log("error", err.message);
            }
            else {
                let queryText = `DELETE FROM items WHERE items.id = ('${process.argv[3]}')`;
                client.query(queryText, (err, res) => {
                    if (err) {
                    console.log("query error", err.message);
                    }
                    else {
                    console.log("Task Deleted");
                    show();
                    }
                })
            }
        });
        break;


}
