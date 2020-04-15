const pg = require('pg');

const configs = {
    user: 'chelseaee',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

const d = new Date();
const today = `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()}`
const now = `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`

const command = process.argv[2]

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        showResults(result);
    }
    client.end();
};


const showResults = res => {
    res.rows.forEach(item => {
        let box = `[ ]`
        item.completion ? box = `[X]` : box
        console.log(`${item.id}. ${box} - ${item.name}`);
    });
};


let clientConnectionCallback = (err) => {

    if (err) {
        console.log("error", err.message);
    }

    if (command === 'add') {
        const inputs = process.argv.slice(3).join(" ");

        let text = `INSERT INTO items (name) VALUES ('${inputs}') RETURNING id, name`;

        client.query(text, queryDoneCallback);
        
    } else if (command === 'done') {

        const targetItem = process.argv[3];
        const script = `UPDATE items SET completion = TRUE WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

    } else if (command === 'show') {

        const script = `SELECT * FROM items`
        displayList();

    }

};


const displayList = ()=> {
  client.query(`SELECT * FROM items`, queryDoneCallback);
}

client.connect(clientConnectionCallback);