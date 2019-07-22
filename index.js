
console.log("works!!", process.argv[2]);
const pg = require('pg');

const configs = {
    user: 'nuraqilahrajab',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
//------------------SET UP COMPLETE----------------//



//-------------------SET UP FUNCTION --------------//

let input2 = process.argv[2];
let input3 = [process.argv[3]];
let SHOW_TASKS = 'SELECT * FROM todolist';
let ADD_TASK = 'INSERT INTO todolist (done, task) VALUES ($1, $2)';



let queryDoneCallback = (err, result) => { //
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }

};

let clientConnectionCallback = () => {
    switch(input2) {
        case "show":
        client.query(SHOW_TASKS, queryDoneCallback);
        break;

        case "add":
        client.query(ADD_TASK, input3, queryDoneCallback);
        break;

    }
}

client.connect(clientConnectionCallback);// inside can be function



















// //-------------------------------------------//
// let queryDoneCallback = (err, result) => { //
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("result", result.rows );
//     }

// };




  // const values = ["hello"];

  // client.query(text, values, queryDoneCallback);