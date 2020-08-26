const pg = require('pg');
const moment=require('moment');
var formPhrase = require("font-ascii").default;

const configs={
    user: 'alvischew', //which user created this database.
    host: '127.0.0.1', //who is hosting this database.
    database: 'todo', //which databased
    port: 5432 //which port to use
};


const pool = new pg.Pool(configs); //create a new link to the client which the config.
pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

let commandType = process.argv[2];
let args = process.argv.slice(3);


if(commandType == "add"){
    let values = ['[ ]',args[0]];
    const text = `INSERT INTO items (status,task,updated_at) VALUES ($1, $2,'') RETURNING *`
    pool.query(text, values, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            console.log("Data from query ----", res.rows[0]);
            formPhrase("Task Added", { typeface: "StarWars", color: "yellow" });
        }
    })
}

if(commandType == "done"){
    let values = ['[X]',args[0]];
    const text = `UPDATE items SET status=$1, updated_at=now() WHERE id=$2 RETURNING *`
    pool.query(text, values, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            console.log("Data from query ----", res.rows[0]);
            formPhrase("Task Completed", { typeface: "StarWars", color: "green" });
        }
    })
}

if(commandType == "show"){
    const text = `SELECT * FROM items ORDER BY id ASC`
    pool.query(text, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            console.log("Data from query ----", res.rows);
            formPhrase("To Do List", { typeface: "StarWars", color: "red" });
        }
    })
}

if(commandType == "stats"){
    if(args[0] == "complete-time"){
        const text = `SELECT *, EXTRACT(epoch FROM updated_at::timestamp-created_at::timestamp) AS duration FROM items WHERE NOT updated_at=''`
         pool.query(text, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            let list = res.rows;
            let sum = 0;
            list.forEach(item=>{
                sum += parseInt(item.duration);
            })
            let average = (sum/(list.length*60)).toFixed(2);
            console.log("Average time to complete task ----", average, " mins");
        }
    })

    }else if(args[0] == "add-time") {
        const text = `SELECT COUNT(id), DATE_TRUNC('hour',created_at::timestamp) FROM items GROUP BY DATE_TRUNC('hour',created_at::timestamp)`
        pool.query(text, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            let list = res.rows;
            let numberOfItems = 0;
            list.forEach(item=>{
                numberOfItems += parseInt(item.count);
            })
            let average = (numberOfItems/(list.length)).toFixed(2);
            console.log("Average number of tasks daily ----", average);
        }
    })
    } else if(args[0] == "best-worst") {
        const text = `SELECT *, EXTRACT(epoch FROM updated_at::timestamp-created_at::timestamp) AS duration FROM items WHERE NOT updated_at='' ORDER BY duration ASC`
        pool.query(text, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            let fastestTask = (parseInt(res.rows[0].duration/60)).toFixed(2);
            let slowestTask = (parseInt(res.rows[res.rows.length-1].duration/60)).toFixed(2);
                console.log("Fastest Completion Time: ",res.rows[0].task,": ",fastestTask, " Slowest Completion Time: ", res.rows[res.rows.length-1].task,": ",slowestTask)
        }
    })
    } else if (args[0] == "between"){
        let arrangement = args[4] == "asc" ? 'ASC' : 'DESC';
        let values = [moment(args[1],"MM DD YYYY") , moment(args[2],"MM DD YYYY")];
        let text = `SELECT *, EXTRACT(epoch FROM updated_at::timestamp-created_at::timestamp) AS duration FROM items WHERE updated_at::timestamp > $1 AND updated_at::timestamp < $2 ORDER BY duration ${arrangement}`
        pool.query(text,values, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            res.rows.forEach(item=>{
                console.log(`${item.task} was completed in ${parseInt((item.duration/60).toFixed(2))} mins. `)
            })
        }
    })

    }
}

if(commandType == "between"){
        let lower = moment(args[0],"MM DD YYYY");
        let higher = moment(args[1],"MM DD YYYY");
        let values=[lower,higher]
    if(args[2] == "ongoing"){
        const text = `SELECT * FROM items WHERE created_at > $1 AND created_at < $2`
        pool.query(text, values, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            res.rows.forEach(item=>{
                let time = moment(item.created_at).format('MM DD YYYY');
                console.log("Task: ", item.task, " ", "Added on: ", time)
            })
        }
    })
    } if(args[2] == "completed"){
        let values = [args[0],args[1]];
        const text = `SELECT * FROM items WHERE updated_at::timestamp > $1 AND updated_at::timestamp < $2`
        pool.query(text, values, (err,res)=>{
        if(err){
            console.log("query error", err.message)
        } else {
            res.rows.forEach(item=>{
                let time = moment(item.updated_at).format('MM DD YYYY');
                console.log("Task: ", item.task, " ", "Completed on: ", time)
            })
        }
    })
    }
}