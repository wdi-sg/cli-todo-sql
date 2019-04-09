

// console.log("works!!", process.argv[2]);



const pg = require('pg');

const configs = {
    user: 'asadullah',
    host: '127.0.0.1',
    database: 'asadullah',
    port: 5432,
};

const client = new pg.Client(configs);


//to add-------------------------------------------------------------------------------
// const onQueryFinished = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {

//       // console.log("result", result.rows );
//       for( let i=0; i<result.rows.length; i++ ){

//           console.log("result: ", result.rows[i]);

//         // make a separate console for each result
//         // console.log("result: "+ result.rows[i].name);
//       }
//     }
// };

// const onConnectServer = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }
// let queryText = 'INSERT INTO todolist (task, completion) VALUES ($1, $2) RETURNING id';

//   const values = ["cook lunch", " "];

//   client.query(queryText, values,  onQueryFinished);

// };

// client.connect(onConnectServer);

// //to delete----------------------------------------------------------------------------------

// const onQueryFinished = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {

//       // console.log("result", result.rows );
//       for( let i=0; i<result.rows.length; i++ ){

//           console.log("result: ", result.rows[i]);

//         // make a separate console for each result
//         // console.log("result: "+ result.rows[i].name);
//       }
//     }
// };

// const onConnectServer = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }
// let queryText = 'DELETE FROM todoList WHERE id = 6';

//   client.query(queryText, onQueryFinished);

// };

// client.connect(onConnectServer);


// to edit---------------------------------------------------------------------------------------

// const onQueryFinished = (err, result) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {

//       // console.log("result", result.rows );
//       for( let i=0; i<result.rows.length; i++ ){

//           console.log("result: ", result.rows[i]);

//         // make a separate console for each result
//         // console.log("result: "+ result.rows[i].name);
//       }
//     }
// };

// const onConnectServer = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }
//   //change id here
// let queryText = 'DELETE FROM todoList WHERE id = 4';

//   client.query(queryText, onQueryFinished);

// };

// client.connect(onConnectServer);

// const onConnectServer2 = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }
// let queryText = 'INSERT INTO todolist (task, completion) VALUES ($1, $2) RETURNING id';
// // rename value from deleted && mark completion as X
//   const values = ["code app", "X"];

//   client.query(queryText, values,  onQueryFinished);

// };

// client.connect(onConnectServer2);


//show in terminal ---------------------------------------------------------------

const onConnectServer3 = (err) => {
let queryText = 'SELECT * FROM todoList';

client.query(queryText, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      // iterate through all of your results:
      for( let i=0; i<res.rows.length; i++ ){
        console.log("result: ", res.rows[i]);
      }
    }
})};

client.connect(onConnectServer3);