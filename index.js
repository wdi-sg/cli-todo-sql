const pg = require('pg');

const configs = {
    user: 'shwj',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


//***************BEFORE STARTING. PREPARE POSTGRES (psql). CREATE TABLE************///

//takes in results from query. Output into checklist form.
let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        if(result.rows.length == 0){
            console.log(`Please add items to your list!`);
        } else {
            result.rows.forEach(function(item,index){
                if(result.rows[index].done == false){
                    console.log(`${result.rows[index].id}. [ ] - ${result.rows[index].task}`);
                } else if (result.rows[index].done == true){
                    console.log(`${result.rows[index].id}. [X] - ${result.rows[index].task}`);
                }
            })
        }
    }
}

//acknowledges done with task request
let actionCompleted = (err,result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("Instructions recieved!");
    }
}

//ADD TASK
let addTasks = (taskItem) => {
    let singleTask = taskItem;
    const now = new Date()
    client.connect(addTask = () =>{

        let text = `INSERT INTO items (task,created_at) VALUES ($1,$2);`

        client.query(text, [singleTask, now], actionCompleted);
    })
}

//SHOW ALL TASK
let showTasks = ()=>{
    client.connect(outputData = () =>{
        let text = "SELECT * FROM items";
        client.query(text, queryDoneCallback);
    });
}

//ASSIGN DONE WITH TASK
let doneWithTask = (itemId) =>{
    let id = itemId;
    client.connect(markTheTask = () =>{
        let text = `UPDATE items SET done=true WHERE id = ${id}`;
        client.query(text, actionCompleted);
    });
}

//JUST IN CASE
let deleteTable = () => {
    client.connect(markTheTask =() =>{
        let text = `DROP TABLE items`;
        client.query(text,actionCompleted);
    })
}

//CREATES TABLE
let createTable = () =>{
    client.connect(()=>{
        let text = `CREATE TABLE items (
                    id SERIAL PRIMARY KEY,
                    task text,
                    done BOOLEAN,
                    created_at TIMESTAMP
                    );`
        client.query(text,actionCompleted);
    })
}

//SETS BOOLEAN VALUE TO DONE COLUMN
let setBoolean = () =>{
    client.connect(()=>{
        let text = `ALTER TABLE items ALTER COLUMN done SET DEFAULT FALSE;
                    ALTER TABLE items ALTER COLUMN done SET NOT NULL;
                    UPDATE items SET done=FALSE;`
        client.query(text,actionCompleted);
    })
}

var main = function(userCommand, userInput){
    switch (userCommand) {
        case "show":
        showTasks();
        break;

        case "add":
        addTasks(userInput);
        break;

        case "done":
        doneWithTask(userInput);
        break;

        case "delete":
        deleteTask(userInput);
        break;
    //clear table. create table. set boolean column.
        case "clear":
        deleteTable();
        break;

        case "create":
        createTable();
        break;

        case "boo":
        setBoolean();
        break;
    }
}

main(process.argv[2],process.argv[3]);