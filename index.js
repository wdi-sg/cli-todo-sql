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
let archiveIndex = [];
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
                    if(response.rows[i].done == null){
                        console.log(`${response.rows[i].id}. ${response.rows[i].checkbox}${response.rows[i].item}.------>Created on ${day}/${month}/${year} ${hours}:${minutes}:${seconds}`)
                    } else {
                        let comp = ((response.rows[i].done - response.rows[i].log)/(1000 * 3600))%24;
                        console.log(`${response.rows[i].id}. ${response.rows[i].checkbox}${response.rows[i].item}.------>Created on ${day}/${month}/${year} ${hours}:${minutes}:${seconds} Average completion time: ${comp.toFixed(2)} hours`)
                    }
                }
            }
        })
    } break;
    case "done": {
        let index = parseInt(argv[1]);
        let queryUpdate = `UPDATE todo SET (checkbox,done) = ('${donebox}','${Date.now()}') WHERE id='${index}'`
        formPhrase("Done", { typeface: "StarWars", color: "green" });
        pool.query(queryUpdate, (err, response) => {
            if(err) console.log(err);
        })
        } break;
    case "archive": {
        formPhrase("Archived", { typeface: "StarWars", color: "white" });
        console.log("Type 'node index.js show' to see the results")
        archiveIndex.push((parseInt(argv[1])));
    } break;
    case "stats": {
        let query = `SELECT * FROM todo ORDER BY done`
        pool.query(query, (err, response) => {
            let rows = response.rows;
            console.log(`Task with the longest time: ${response.rows[0].item}`)
            for(let i = response.rows.length - 1; i > 0; i--) {
                if(response.rows[i].done == null){
                    continue;
                } else {
                    console.log(`Task with the longest time: ${response.rows[i].item}`)
                    break;
                }
            }
        })
    }
}