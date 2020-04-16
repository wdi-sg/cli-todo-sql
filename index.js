





console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
console.log("~~~~~~~~~ TO DO LIST PROGRAM ~~~~~~~~");
console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");


const pg = require('pg');

const configs = {
    user: 'shane',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const consoleCommand = process.argv[2];

// A function that reads what command user inputted
checkCommand = (input) => {
    console.log("Checking for command")

    const client = new pg.Client(configs);

    // create a global status to make sure only correct commands are true
    let commandStatus = false

    if( consoleCommand == "add"){
        commandStatus = true;
        console.log("-----------------------");
        console.log("INITIALIZE COMMAND: ADD");

        // This function runs if query returns a response
        let queryDoneCallback = (err, result) => {

            if (err) {
                console.log("////////////////////////");
                console.log("ADD ERROR");
                console.log(err.message);
                console.log("////////////////////////");
            } else {
                // ???
                // how do I view what is inside result.rows object?
                console.log("result", result.rows );
            }
            // ???
            // why put this code outside of else block?
            console.log("-----------------------");
            console.log("DISCONNECTING DATABASE")
            client.end();
        };


        // Only activates when connection is successful
        let addnewList = (err) => {
          // checks if connection has errors
          if( err ){
            console.log("////////////////////////");
            console.log("CONNECTION ERROR :");
            console.log( err.message );
            console.log("////////////////////////");
          }
          // specifies where to add the data
          let text = "INSERT INTO todoitems (status, instructions) VALUES ($1, $2) RETURNING id";
          // retrieve input from process to fill data
          const inputData = [process.argv[3], process.argv[4]];

          client.query(text, inputData, queryDoneCallback);
          console.log("-----------------------");
          console.log("finished query...");
        };
        console.log("-----------------------");
        console.log("making the connection to database [todo]...");
        client.connect(addnewList);
    }





    // command to edit the list
    if( consoleCommand == "edit"){
        commandStatus = true;
        console.log("-----------------------");
        console.log("INITIALIZE COMMAND: EDIT");
        console.log();
    }





    // command to delete one list
    if( consoleCommand == "delete"){
        commandStatus = true;
        console.log("-----------------------");
        console.log("INITIALIZE COMMAND: DELETE");

        queryDoneCallback = (err, remainder) =>{
            if(err){
                console.log("////////////////////////");
                console.log("CONNECTION ERROR :");
                console.log( err.message );
                console.log("////////////////////////");
            } else {
                console.log("-----------------------");
                console.log("deleted")
            }
            client.end();
        }

        deleteList = () =>{
            let text = "DELETE FROM todoitems WHERE id = 10"
            client.query(text,queryDoneCallback)
        };

        client.connect(deleteList);
    }





    // command to view the list
    if( consoleCommand == "view"){
        commandStatus = true;
        console.log("-----------------------");
        console.log("INITIALIZE COMMAND: VIEW");

        let queryDoneCallback = (err, result) => {
            if (err) {
                console.log("////////////////////////");
                console.log("ADD ERROR");
                console.log(err.message);
                console.log("////////////////////////");
            } else {
                // ???
                // how do I view what is inside result.rows object?
                console.table( result.rows );
            }
            // ???
            // why put this code outside of else block?
            console.log("-----------------------");
            console.log("DISCONNECTING DATABASE")
            client.end();
        };

        viewList = (err) => {
            if(err){
                console.log("////////////////////////");
                console.log("CONNECTION ERROR :");
                console.log( err.message );
                console.log("////////////////////////");
            }
            let listTable = "SELECT * FROM todoitems";

            client.query(listTable, queryDoneCallback);

        }
        console.log("-----------------------");
        console.log("making the connection to database [todo]...");
        client.connect(viewList)
    }





    // checks if command does not exist
    if(commandStatus === false){
    console.log("////////////////////////");
    console.log("ERROR: COMMAND DOES NOT EXIST");
    console.log("entered command: " + consoleCommand);
    console.log("////////////////////////");
    }
};

checkCommand();