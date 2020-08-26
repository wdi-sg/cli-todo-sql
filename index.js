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
        let {id,completed,activity} = item;
        let mark = completed ? "x" : " ";
        let text = `${id}. [${mark}] - ${activity}`;
        console.log(text);
    })
}

let showAll =()=>{
    // always show in sequential order
    query = "SELECT * FROM items WHERE archived = false ORDER BY id;";
    getData(query).then(result=>handleShow(result)).then(()=>client.end()).catch(err=>console.log(err))
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
    console.log(query);
    updateById(query).then(()=>showAll())
}

if (program.stats === true) console.log("stats options are: complete-time, add-time, best-worst");
else if (program.stats === 'complete-time') console.log('complete-time'); // get data
else if (program.stats === 'add-time') console.log('add-time'); // get data
else if (program.stats === 'best-worst') console.log('best-worst'); // get data


if (program.between === true) console.log("options are: add, done");
else if (program.between === "add") console.log("between add"); //get data
else if (program.between === "done") console.log("between done"); //get data
if (program.debug) console.log(program.opts());