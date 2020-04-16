const pg = require('pg');

const configs = {
    user: 'chanosborne',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

client.connect((err) => {
    if (err) {
        console.log('connectionError', err.message);
    }

    let commandType = process.argv[2];
    let values = [];
    let queryText;

    if (commandType === 'show') {
        queryText = 'SELECT * FROM items';
    } else if (commandType === 'add') {
        let inputTask = process.argv[3];
        values = [inputTask];
        queryText = "INSERT INTO items (done, task) VALUES ('[] -', $1) RETURNING *";
    } else if (commandType === 'done') {
        let inputId = process.argv[3];
        values = [inputId];
        queryText = "UPDATE items SET done='[x] -' WHERE id=$1 RETURNING *";
    } else if (commandType === 'sort') {
        if (process.argv[3].toUpperCase() === 'ASC') {
            queryText = "SELECT * FROM items ORDER BY id ASC";
        } else if (process.argv[3].toUpperCase() === 'DESC') {
            queryText = "SELECT * FROM items ORDER BY id DESC";
        }
    }

    client.query(queryText, values, (err, res) => {
        if (err) {
            console.log('queryError', err.message)
        } else {
            res.rows.forEach(row => {
                console.log(`${row.id}. ${row.done} ${row.task}`);
            })
        }
    })
});