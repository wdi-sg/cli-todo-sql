console.log("works!!", process.argv[2]);
var formPhrase = require("font-ascii").default;
const pg = require('pg');
const configs = {
    user: 'eugenelim',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};
const pool = new pg.Pool(configs);

let argv = process.argv.splice(2);
let archiveIndex = [2, 4, 5];
let i = 0;
let checkbox = "[ ] - ";
let donebox = "[X] - ";
switch(argv[0].toLowerCase()) {
    case "add": {
        let currentTime = ( new Date() ).toLocaleDateString().split("/");
        let queryAdd = `INSERT INTO todo(checkbox,item, log) VALUES ('${checkbox}', '${argv[1]}')`
        pool.query(queryAdd, (err, response)=> {
            formPhrase("Added", { typeface: "StarWars", color: "yellow" });
        });
    }; break;
    case "show": {
        let queryShow = `SELECT * FROM todo ORDER BY id ASC`
        formPhrase("To do List", { typeface: "StarWars", color: "white" });
        pool.query(queryShow, (err, response)=> {
            for(let i = 0, j = 0; i < response.rows.length; i++) {
                if(archiveIndex[j] == response.rows[i].id){
                    j++;
                    continue;
                } else {
                    let day = response.rows[i].log.getDate(), month = response.rows[i].log.getMonth(), year = response.rows[i].log.getFullYear();
                    let hours = response.rows[i].log.getHours(), minutes = response.rows[i].log.getMinutes(), seconds = response.rows[i].log.getSeconds();
                    console.log(`${response.rows[i].id}. ${response.rows[i].checkbox}${response.rows[i].item}.------>Created on ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`)
                }
            }
            // response.rows.forEach(row => {
            //     // if(archiveIndex[i] == row.id) {
            //     //     i++;
            //     // } else {
            //         let day = row.log.getDate(), month = row.log.getMonth(), year = row.log.getFullYear();
            //         let hours = row.log.getHours(), minutes = row.log.getMinutes(), seconds = row.log.getSeconds();
            //         console.log(`${row.id}. ${row.checkbox}${row.item}.------>Created on ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`)
            //     // }
            // })
        })
    } break;
    case "done": {
        let index = parseInt(argv[1]);
        let queryUpdate = `UPDATE todo SET checkbox='${donebox}' WHERE id='${index}'`
        formPhrase("Done", { typeface: "StarWars", color: "green" });
        pool.query(queryUpdate, (err, response) => {})
        } break;
    // case "archive": {
    //     archiveIndex = .push(parseInt(argv[1]));

    // }
}















let queryDoneCallback = (err, result) => {
    if (err) {
      console.log("query error", err.message);
    } else {
      console.log("result", result.rows );
    }
    pool.end();
};

// let poolConnectionCallback = (err) => {
//   if( err ){
//     console.log( "error", err.message );
//   }
//   let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";
//   const values = ["hello"];
//   pool.query(text, values, queryDoneCallback);
// };
// pool.connect(poolConnectionCallback);