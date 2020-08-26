#!/usr/bin/env node

const { program } = require('commander');
program.version('0.0.1');

const moment = require('moment');
// set up for psql
const pg = require('pg');

const configs = {
    user: 'Hilman',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


// declare options here
program
    .option('-s, --show', 'show all items')
    .option('-a, --add <activity>', 'add new item')
    .option('-d, --done <id>', 'mark item as done')
    .option('--stats [option]', 'show stat option')
    .option('--between [option]', 'show all items')
    .option('--archive <id>', 'archive item')
    .option('--debug', 'show all options')


// parse cli option and params
program.parse(process.argv);


// all handlers must end connection at the end of the execution

client.connect();

async function getData(query) {
    try{
        let result = await client.query(query);
        return result.rows
    } catch(err) {
        client.end();
        console.log(err);
    }
}

async function addData(query) {
    try{
        let result = await client.query(query);
    } catch(err) {
        client.end();
        console.log(err);
    }
}

async function updateById(query) {
    try{
        let result = await client.query(query);
    } catch(err) {
        client.end();
        console.log(err);
    }
}

let handleShow =(array)=> {
    array.forEach((item, index)=>{
        let {id,completed,activity, created_at, updated_at} = item;
        let mark = completed ? "x" : " ";
        let date = moment(created_at).format("Do MMMM YYYY");
        let doneDate = completed ? "Completed: " + moment(updated_at).format("Do MMMM YYYY") : "";
        let text = `${id}. [${mark}] - ${activity} Created: ${date} ${doneDate}`;
        console.log(text);
    })
}

let showAll =()=>{
    // always show in sequential order
    query = "SELECT * FROM items WHERE archived = false ORDER BY id;";
    getData(query).then(result=>handleShow(result)).then(()=>client.end()).catch(err=>console.log(err))
}

let handleCompleteTime =(array)=> {
    let sum = array.reduce((acc, obj)=>{
        let a = moment(obj.created_at);
        let b = moment(obj.updated_at);
        let diff = b.diff(a, 'minutes', true)
        return acc + diff;
    },0)
    let average = sum / array.length;
    console.log("Average time to complete in minutes: " + average);
}

// detecting user selection

let query = null;

if (program.show) {
    showAll();
};

//insert
if (program.add) {
    query = `INSERT INTO items (completed,archived,activity) VALUES (false, false,'${program.add}');`
    addData(query);
    showAll();
};

//update
if (program.done) {
    query = `UPDATE items SET completed = true, updated_at = now() WHERE id = ${program.done}`
    updateById(query).then(()=>showAll())
};

if (program.archive) {
    query = `UPDATE items SET archived = true, updated_at = now() WHERE id = ${program.archive}`
    updateById(query).then(()=>showAll())
};

if (program.stats === true) {

    console.log("stats options are: complete-time, add-time, best-worst");

} else if (program.stats === 'complete-time') {

    query = 'SELECT created_at, updated_at FROM items WHERE completed = true;'
    getData(query)
        .then((result)=>handleCompleteTime(result))
        .then(()=>client.end())
        .catch(err=>console.log(err))

} else if (program.stats === 'add-time') {
    console.log('add-time');
} else if (program.stats === 'best-worst') {
    console.log('best-worst');
}


if (program.between === true) console.log("options are: add, done");
else if (program.between === "add") console.log("between add"); //get data
else if (program.between === "done") console.log("between done"); //get data
if (program.debug) console.log(program.opts());