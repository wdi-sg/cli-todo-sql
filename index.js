console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'jasonw',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
    password: '1234'
};

const client = new pg.Client(configs);

let queryText = 'SELECT * FROM todo';


let displayTasks = (err) => {
    if (err) {
        console.log("error");
    }
    client.query(queryText, (err, res) => {
        if (err) {
            console.log("query error",err.message);
        } else {
            for(let i = 0; i < res.rows.length; i++) {
                let checked;
                if (res.rows[i].checked) {
                    checked = "[x]";
                }
                else {
                    checked = "[ ]";
                }
                console.log(res.rows[i].id + checked + res.rows[i].task);
            }
        }
        //console.log("result", res.rows);
    });
}

let addTasks = (err) => {
    if (err) {
        console.log("error", err.message);
    }
    let queryText = 'INSERT INTO todo (task, checked) VALUES ($1, $2)';
    const values = [process.argv[3], false];
    client.query(queryText, values,displayTasks);
}



if (process.argv[2] === "show") {
    client.connect(displayTasks);
}
if(process.argv[2] == "add") {
    client.connect(addTasks);
}

//client.connect(clientConnectionCallback);






//INSERT INTO movies (title, description, rating) VALUES('Cars', 'a movie', 9) RETURNING *;