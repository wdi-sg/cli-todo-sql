console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'Admin',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let text = 'SELECT * FROM items';

//standard text//
const somthing = (err) => {

  if( err ){
    console.log( "error", err.message );
  }

  client.query(text, (err, res) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", res.rows);
    }
  });

}


// let queryText = "INSERT INTO items (Name) VALUES ('go shopping')";
// const insert = (err) => {

//   if( err ){
//     console.log( "error", err.message );
//   }

//   client.query(queryText, (err, res) => {
//     if (err) {
//       console.log("query error", err.message);
//     } else {
//       console.log("done!");
//     }
// });
// }


let queryText2 = 'INSERT INTO items (Name) VALUES ($1) RETURNING id';

const values = [process.argv[3]];

//standard text
const insert2 = (err) => {
  client.query(queryText2, values, (err, res) => {
      if (err) {
        console.log("query error", err.message);
      } else {
        console.log("id of the thing you just created:", res.rows[0].id);
      }
  });
}

let queryText3 = "DELETE FROM items WHERE name='scott'";


// // const delete1 = (err) => {
// //   client.query(queryText3, (err, res) => {
// //       if (err) {
// //         console.log("query error", err.message);
// //       } else {
// //         console.log("id of the thing you just created:");
// //       }
// //   });
// }
if (process.argv[2] === "add") {
  client.connect(insert2)
} 

if (process.argv[2] === "show") {
  client.connect(somthing)
} 


// client.connect(somthing)
