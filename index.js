const pg = require('pg');
const configs = {
user: 'apooshoo',
password: 'neilgaiman1',
host: '127.0.0.1',
database: 'testdb',
port: 5432,
};
const client = new pg.Client(configs);

//--------------^^config^^
console.log("works!!", process.argv[2]);

var commandType = process.argv[2];

console.log("Your command was: "+commandType);

//---------------^^global vars^^

client.connect((err) => {
    if (err){
        console.log("error", err.message);
    } else if (commandType === "add"){
        let task = process.argv[3];
        let queryText = 'INSERT INTO todo (task, done) VALUES ($1, $2) RETURNING id';
        let values = [task, 'false'];
        client.query(queryText, values, (err, res) => {
            if (err){
                console.log("query err", err.message);
            } else {
                let orderText = 'SELECT * FROM todo ORDER BY id';
                client.query(orderText, (err, res) => {
                    console.log("after add:", res.rows);
                })
            }
        })
    } else if (commandType === "show"){
        let queryText = 'SELECT * FROM todo';
        client.query(queryText, (err, res) => {
            if (err){
                console.log("query err", err.message);
            } else {
                let orderText = 'SELECT * FROM todo ORDER BY id';
                client.query(orderText, (err, res) => {
                    console.log("List:", res.rows);
                })
            }
        })
    } else if (commandType === "done"){
        let doneItemId = process.argv[3];
        let queryText = `UPDATE todo SET done=true WHERE id=${doneItemId}`;
        console.log("querytext: "+queryText);
        client.query(queryText, (err, res) => {
            if (err){
                console.log("query err", err.message);
            } else {
                let orderText = 'SELECT * FROM todo ORDER BY id';
                client.query(orderText, (err, res) => {
                    console.log("after update:", res.rows);
                })
            }
        })
    } else if (commandType === "delete"){
        let deleteItemId = process.argv[3];
        let queryText = `DELETE FROM todo WHERE id=${deleteItemId}`;
        client.query(queryText, (err, res) => {
            if (err){
                console.log("query err", err.message);
            } else {
                let orderText = 'SELECT * FROM todo ORDER BY id';
                client.query(orderText, (err, res) => {
                    console.log("after delete and order:", res.rows);
                })

            }
        })
    }
})

//truncate table todo restart identity