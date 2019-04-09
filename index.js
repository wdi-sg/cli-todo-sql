console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'jordanlee',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};



const client = new pg.Client(configs);
var add = function (newItem) {
    const onQueryFinished = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            for( let i=0; i<result.rows.length; i++ ){
                console.log("result: ", result.rows[i]);
            }
        }
    };
    const onConnectServer = (err) => {
                if( err ){
            console.log( "error", err.message );
        }
        let queryText = 'INSERT INTO items (done, activity) VALUES ($1, $2) RETURNING id';
        const values = ["undone", newItem];
        client.query(queryText, values,  onQueryFinished);
         };

    client.connect(onConnectServer);
}






// const client = new pg.Client(configs);
// var add = function (newItem) {
//     const onQueryFinished = (err, result) => {
//         if (err) {
//             console.log("query error", err.message);
//         } else {
//             for( let i=0; i<result.rows.length; i++ ){
//                 console.log("result: ", result.rows[i]);
//             }
//         }
//     };
//     const onConnectServer = (err) => {
//         if( err ){
//             console.log( "error", err.message );
//         }
//         let queryText = 'INSERT INTO items (done, activity) VALUES ($1, $2) RETURNING id';
//         const values = ["undone", newItem];
//         client.query(queryText, values,  onQueryFinished);
//     };
//     client.connect(onConnectServer);
// }
// var show = function () {
//     const onQueryFinished = (err, result) => {
//         if (err) {
//             console.log("query error", err.message);
//         } else {
//          //   console.log(result)
//             for( let i=0; i<result.rows.length; i++ ){
//                 if ( result.rows[i].done == "undone") {
//                     console.log( result.rows[i].id + ". [ ] - " + result.rows[i].activity );
//                 } else if ( result.rows[i].done == "done") {
//                     console.log( result.rows[i].id + ". [x] - " + result.rows[i].activity );
//                 }
//             }
//         }
//     };
//     const onConnectServer = (err) => {
//         if( err ){
//             console.log( "error", err.message );
//         }
//         let queryText = 'SELECT * FROM items ORDER BY id';
//         client.query(queryText, onQueryFinished);
//     };
//     client.connect(onConnectServer);
// }
// var done = function (itemNum) {
//     const onQueryFinished = (err, result) => {
//         if (err) {
//             console.log("query error", err.message);
//         } else {
//             for( let i=0; i<result.rows.length; i++ ){
//                 console.log("result: ", result.rows[i]);
//             }
//         }
//     };
//     const onConnectServer = (err) => {
//         if( err ){
//             console.log( "error", err.message );
//         }
//         // const now = ;
//         let queryText = "UPDATE items SET done='done', updated_at='NOW' WHERE id = '"+itemNum+"';";

//         let queryText = "UPDATE items SET done='done' WHERE id = '"+itemNum+"';";
//         client.query(queryText, onQueryFinished);

//     };

//     client.connect(onConnectServer);

// }