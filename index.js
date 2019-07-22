// Postgres database
const pg = require('pg');
const configs = {
    user: 'shirleytan',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432
};
const client = new pg.Client(configs);

//store user command
let userCommand = process.argv[2];

// add item function
const addItem = () => {
    let userInput = "";
    for(let i=0;i<process.argv.length-3;i++){
        userInput += process.argv[i+3]+" ";
    }
    userInput = userInput.substring(0, userInput.length-1);
    const date = new Date();
    const currentDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

    client.connect((err) => {
        if (err) {
            console.log("ERROR: " + err);
        } else {
            let queryText = "INSERT INTO items (name, checked, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *";
            const values = [userInput, "[ ]", currentDate, ""];
            client.query(queryText, values, (err,res) => {
                if (err) {
                    console.log("ERROR: " + err);
                }
                console.log(`${res.rows[0].name} have been added to the todo list on ${res.rows[0].created_at}`);
            })
        }
    });
};
// show items function
const showItem = () => {
    client.connect((err) => {
        if (err) {
            console.log("ERROR: " + err);
        } else {
            let queryText = "SELECT * FROM items";
            client.query(queryText, (err,res) => {
                if (err) {
                    console.log("ERROR: " + err);
                }
                res.rows.map((row,i) => {
                    if (row.updated_at === "") {
                        console.log(`${i + 1}. ${row.checked} – ${row.name} (created on ${row.created_at})`);
                    } else {
                        //create date object from item date info
                        console.log(`${i + 1}. ${row.checked} – ${row.name} (updated on ${row.updated_at})`);
                    }
                });
            })
        }
    });
};

// check item as done function
const checkDone = () => {
    let userInput = parseInt(process.argv[3]);
    if (Number.isNaN(userInput)){
        console.log("Please key in a valid number.");
    }
    else {
        client.connect((err) => {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                let queryText = "SELECT * FROM items";
                client.query(queryText, (err,res) => {
                    if (err) {
                        console.log("ERROR: " + err);
                    }
                    let selectedName = res.rows[userInput-1].name;
                    if (res.rows[userInput-1].checked === '[x]') {
                        console.log(`'${selectedName}' have already been checked as done.`);
                    }
                    else {
                        const date = new Date();
                        const currentDate = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();

                        let queryText = `UPDATE items SET checked ='[x]', updated_at ='${currentDate}' WHERE name = '${selectedName}' RETURNING *`;
                        client.query(queryText, (err,res) => {
                            if (err) {
                                console.log("ERROR: " + err);
                            }
                            console.log(`'${res.rows[0].name}' have been checked as done.`);
                        });
                    }
                })
            }
        });
    }
};

// delete item
const deleteItem = () => {
    let userInput = parseInt(process.argv[3]);
    if (Number.isNaN(userInput)){
        console.log("Please key in a valid number.");
    }
    else {
        client.connect((err) => {
            if (err) {
                console.log("ERROR: " + err);
            } else {
                let queryText = "SELECT * FROM items";
                client.query(queryText, (err,res) => {
                    if (err) {
                        console.log("ERROR: " + err);
                    }
                    let selectedName = res.rows[userInput-1].name;
                    let queryText = `DELETE FROM items WHERE name = '${selectedName}' RETURNING *`;
                    client.query(queryText, (err,res) => {
                        if (err) {
                            console.log("ERROR: " + err);
                        }
                        console.log(`'${res.rows[0].name}' have been deleted.`);
                    });
                })
            }
        });
    }
};

const showInstructions = () => {
    console.log("To use any of the following commands, enter the command key:");
    console.log("add – Add new item (e.g. add buy groceries)");
    console.log("show – Show items");
    console.log("done – Check item as done (e.g. done 2)");
    console.log("delete – Remove item (e.g. delete 2)");
};

// if user did not enter a command
if (!userCommand) {
    showInstructions();
}
else {
    userCommand = userCommand.toLowerCase();
    // check what command the user have entered
    switch (userCommand) {
        case "add" :
            addItem();
            break;
        case "show" :
            showItem();
            break;
        case "done" :
            checkDone();
            break;
        case "delete" :
            deleteItem();
            break;
        default:
            console.log("Please key in a valid command.");
            break;
    }
}