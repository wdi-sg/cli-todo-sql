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

        if (item.archived) {
            return;
        }

        let box = `[ ]`
        if (item.completion) {
            box = `[X]`
            let output = `${item.id}. ${box} - ${item.name} \n Created: ${item.created_at} \n Completed: ${item.completed_at} \n =======================`;
            colorLog('green', output);
        } else {
            let output = `${item.id}. ${box} - ${item.name} \n Created: ${item.created_at} \n =======================`;
            colorLog('red', output)
        }
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
        const script = `UPDATE items SET completion = TRUE, completed_at = CURRENT_TIMESTAMP WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

    } else if (command === 'show') {

        const script = `SELECT * FROM items`
        displayList();

    } else if (command === 'archive') {
        const targetItem = process.argv[3];
        const script = `UPDATE items SET archived = TRUE WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);

    } else if (command==='unarchive') {
        const targetItem = process.argv[3];
        const script = `UPDATE items SET archived = FALSE WHERE id=${targetItem}`
        client.query(script, queryDoneCallback);
    }

};


const displayList = ()=> {
  client.query(`SELECT * FROM items`, queryDoneCallback);
}

client.connect(clientConnectionCallback);



//Function to format colors of console logs: lavender, green or red.
const colorLog = (col, output) => {
    let r;
    let g;
    let b
    if (col === 'lavender') {
        r = 181;
        g = 126;
        b = 220
    } else if (col === 'red') {
        r = 230;
        g = 0;
        b = 0;
    } else if (col === 'green') {
        r = 0;
        g = 230;
        b = 0
    }

    console.log(`\x1b[38;2;${r};${g};${b}m%s\x1b[0m`, output);
}