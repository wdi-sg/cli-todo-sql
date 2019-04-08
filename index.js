// node index.js commandType secondArg
const commandType = process.argv[2];
const secondArg = process.argv[3];

// Reference
// const add = (todo) => {
//     jsonfile.readFile(file,(err, json) => {
//         const obj = {};
//         const arr = json["todoItems"];
//         const index = arr.length + 1;
//         obj.index = index;
//         obj.name = todo;
//         obj.completed = false;
//         arr.push(obj);
//         console.log(`${index}. [ ] - ${todo}`);
//         jsonfile.writeFile(file, json, (err) => {
//             if (err) {
//                 console.log("ERROR");
//             }
//             // console.log(`${index}. [ ] - ${todo}`);
//         });
//     });
// }

const pg = require('pg');

const configs = {
    user: 'andyng',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let queryDoneCallback = (err, result) => {
    if (err) {
        console.log("query error", err.message);
    } else {
        // Over here we have 2 conditional statement checking if user is adding todo or user wants to view todo
        // Is there a way to add todo and have result.rows contain SELECT * FROM items?
        const arr = result.rows;
        if (arr.length === 1) {
            console.log(`${arr[0].id}. [ ] - ${arr[0].name}`);
        } else if (arr.length > 1) {
            for (let i = 0; i < arr.length; i++) {
                console.log(`${i + 1}. [ ] - ${arr[i].name}`);
            }
        }
    }
};

// We need to pass in secondArg(process.argv[3])
let clientConnectionCallback = (err) => {
    if (err) {
        console.log( "error", err.message );
    }
    // This text is the SQL 'command' to handle data
    // items is the name of the table we created
    // We can return * to return all properties of the 'obj'
    let text = "INSERT INTO items (name) VALUES ($1) RETURNING *";
    // we have to push an arr
    const values = [];
    values.push(secondArg);
    client.query(text, values, queryDoneCallback);
};

let showToDos = (err) => {
    if (err) {
        console.log( "error", err.message );
    }
    let text = "SELECT * FROM items";
    client.query(text, queryDoneCallback);
}

if (commandType === "add") {
    client.connect(clientConnectionCallback);
} else if (commandType === "show") {
    client.connect(showToDos);
}