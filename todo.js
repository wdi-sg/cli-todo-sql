
const commandType = process.argv[2];
const userInput = process.argv[3];

const pg = require('pg');
const figlet = require('figlet');

const configs = {
    user: 'sean',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

var setConsoleBoardMessage = function (content) {
figlet(content, function(err, data) {
        if (err) {
            console.dir(err);
            return;
        }
        console.log(data)

        console.log('Options');
        console.log('1. View activities: Enter "node todo.js show" to view all of the activities in the DB');
        console.log('2. Add new activity: Enter "node todo.js add {activity name}" to add new activity to DB');
        console.log('3. Mark activity as done: Enter "node todo.js done {activity id}" to mark that activity as done in DB');
        console.log('4. Delete activity: Enter "node todo.js delete {activity id}" to delete that activity from the DB');
    });
}

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
        if(result.rows.length > 1) {
            result.rows.forEach(function(element) {
                console.log(element.id + ". " + element.donestatus + " - " + element.activityname);
            });
        } else if(result.rows.length == 1) {
            console.log(result.rows[0].id + ". " + result.rows[0].donestatus + " - " + result.rows[0].activityname);
        }

    }
};

let clientConnectionCallback = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  if(commandType === "add") {

    let today = new Date();
     let dd = today.getDate();
     let mm = today.getMonth() + 1;
     let yyyy = today.getFullYear();
     let hrs = today.getHours();
     let mins = today.getMinutes();
     let secs = today.getSeconds();
     if(hrs >= 0 && hrs <= 12) {
        today = `Date: ${dd}-${mm}-${yyyy} | Time: ${hrs}:${mins}:${secs} AM`;
    } else if(hrs > 12 && hrs <= 23) {
        today = `Date: ${dd}-${mm}-${yyyy} | Time: ${hrs}:${mins}:${secs} PM`;
    }

    let queryText = "INSERT INTO activities (activityname, donestatus, createdat, updatedat) VALUES ($1, $2, $3, $4) RETURNING *";


    const values=[userInput, "[]", today, ""];

    client.query(queryText, values, queryDoneCallback);

  }

  if(commandType === "show") {

    let queryText = "SELECT * FROM activities ORDER BY id";

    client.query(queryText, queryDoneCallback);

}


if(commandType === "done") {


            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1;
            let yyyy = today.getFullYear();
            let hrs = today.getHours();
            let mins = today.getMinutes();
            let secs = today.getSeconds();
            if(hrs >= 0 && hrs <= 12) {
                today = `Date: ${dd}-${mm}-${yyyy} | Time: ${hrs}:${mins}:${secs} AM`;
            } else if(hrs > 12 && hrs <= 23) {
                today = `Date: ${dd}-${mm}-${yyyy} | Time: ${hrs}:${mins}:${secs} PM`;
            }

            let queryText1= "UPDATE activities SET doneStatus='[x]', updatedAt=$2 WHERE id=$1";
            let queryText2= "SELECT * FROM activities ORDER BY id";

            const values= [userInput, today];

            client.query(queryText1, values, queryDoneCallback);
            client.query(queryText2, queryDoneCallback);

        }


        if(commandType === "undone") {

            let queryText1= "UPDATE activities SET doneStatus='[]', updatedAt='' WHERE id=$1";
            let queryText2= "SELECT * FROM activities ORDER BY id";

            const values= [userInput];

            client.query(queryText1, values, queryDoneCallback);
            client.query(queryText2, queryDoneCallback);

        }


        if(commandType === "delete") {

            let queryText = "DELETE from activities WHERE id=$1 RETURNING *";

            const values =[userInput];

            client.query(queryText, values, queryDoneCallback);
        }

        if(commandType === undefined) {
            setConsoleBoardMessage("Sean - To Do List");
        }


};

client.connect(clientConnectionCallback);