const pg = require('pg');

const configs = {
    user: 'cash',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

let userFuncInput = process.argv[2];
let userOptInput = process.argv[3];
let userOptInput2 = process.argv[4];
// let selectAll = `SELECT * FROM todolist`
// let insertData = `INSERT INTO todolist('Index', 'To-Do Description', 'Mark As Done', 'Date created', 'Last updated') VALUES(${res.rows.length + 1}, ${userOptInput}, ' ', DEFAULT, 'N.A.')`



const add = (userInput) => {
    let selectAll = `SELECT * FROM todolist`
    client.query(selectAll, (err, res) => {
        let newIndex = res.rows.length + 1;
        let insertData = `INSERT INTO todolist(index, to_do_description, mark_as_done) VALUES($1, $2, $3) RETURNING *`
        const values = [newIndex, userInput, `NA`];
        client.query(insertData, values, (err, res) => {
            if (err) {
                console.log('query error: ', err.message);
            } else {
                console.log('success!')
                console.log(`${res.rows[0].index}. [${res.rows[0].mark_as_done}] - ${res.rows[0].to_do_description}
                Added on: ${res.rows[0].date_created}
                Updated on: ${res.rows[0].last_updated}
                `);
            }
            client.end((err) => {
                console.log('auto quitting PSQL~')
                if (err) {
                    console.log('error during disconnection', err.message);
                }
            })
        });
    });
};

const update = (userInput, userInput2) => {
    let selectAll = `SELECT * FROM todolist`
    client.query(selectAll, (err, res) => {
        let updateData = `UPDATE todolist SET to_do_description='${userInput2}', last_updated=now() WHERE index='${userInput}' RETURNING *;`
        // const values = [newIndex, userInput, ` `, `no updates yet`];
        client.query(updateData, (err, res) => {
            if (err) {
                console.log('query error: ', err.stack);
            } else {
                console.log('success!')
                console.log(`${res.rows[0].index}. [${res.rows[0].mark_as_done}] - ${res.rows[0].to_do_description}
                Added on: ${res.rows[0].date_created}
                Updated on: ${res.rows[0].last_updated}
                `);
            }
            client.end((err) => {
                console.log('auto quitting PSQL~')
                if (err) {
                    console.log('error during disconnection', err.message);
                }
            })
        });
    });
};

const mark = (userInput) => {
    let selectAll = `SELECT * FROM todolist`
    client.query(selectAll, (err, res) => {
        let markData = `UPDATE todolist SET mark_as_done='X', last_updated=now() WHERE index='${userInput}' RETURNING *;`
        // const values = [newIndex, userInput, ` `, `no updates yet`];
        client.query(markData, (err, res) => {
            if (err) {
                console.log('query error: ', err.stack);
            } else {
                console.log('success!')
                console.log(`${res.rows[0].index}. [${res.rows[0].mark_as_done}] - ${res.rows[0].to_do_description}
                Added on: ${res.rows[0].date_created}
                Updated on: ${res.rows[0].last_updated}
                `);
            }
            client.end((err) => {
                console.log('auto quitting PSQL~')
                if (err) {
                    console.log('error during disconnection', err.message);
                }
            })
        });
    });
};

const show = () => {
    let selectAll = `SELECT * FROM todolist`
    client.query(selectAll, (err, res) => {
        if (err) {
            console.log('query error: ', err.stack);
        } else {
            console.log('success!')
            for (i = 0; i < res.rows.length; i++) {
                console.log(`${res.rows[i].index}. [${res.rows[i].mark_as_done}] - ${res.rows[i].to_do_description}
                Added on: ${res.rows[i].date_created}
                Updated on: ${res.rows[i].last_updated}
                `);
            }
        }
        client.end((err) => {
            console.log('auto quitting PSQL~')
            if (err) {
                console.log('error during disconnection', err.message);
            }
        })
    });
};

const del = (userInput) => {
    let selectAll = `SELECT * FROM todolist`
    client.query(selectAll, (err, res) => {
        let delData = `DELETE FROM todolist WHERE index='${userInput}' RETURNING *;`
        // const values = [newIndex, userInput, ` `, `no updates yet`];

        client.query(delData, (err, res) => {
            if (err) {
                console.log('query error: ', err.stack);
            } else {
                console.log('success!')
            }
            for (i = parseInt(userInput) + 1; i <= res.rows.length; i++) {
                let adjustIndex = `UPDATE todolist SET index=${i-1} WHERE index=${i};`
                client.query(adjustIndex, (err, res) => {
                    if (err) {
                        console.log('adjust index error: ', err.stack);
                    }
                    console.log('adjusting index working!')
                })
            }
            client.end((err) => {
                console.log('auto quitting PSQL~')
                if (err) {
                    console.log('error during disconnection', err.message);
                }
            })
        });
    });
};


client.connect((err) => {

    console.log("connected")

    if (err) {
        console.log("connection error: ", err.message);
    } else {
        switch (userFuncInput) {
            case 'add':
                add(userOptInput);
                break;
            case 'update':
                update(userOptInput, userOptInput2);
                break;
            case 'show':
                show();
                break;
            case 'mark':
                mark(userOptInput);
                break;
            case 'del':
                del(userOptInput);
                break;
            default:
                console.log(`
  Please input in the following format:
  "node index.js * **"

  * = to replace with "add" / "mark" / "del" / "show"
  ** = for "add", input to-to description with quotes, e.g.[  node index.js add "buy food"  ]
  ** = for "mark", input list item no. to be marked,   e.g.[  node index.js mark 3          ]
  ** = for "del", input list item no. to be deleted,   e.g.[  node index.js del 3           ]
  ** = for "show", no secondary input needed,          e.g.[  node index.js show            ]
  `);
        };
    };
});
// let queryDoneCallback = (err, result) => {
//     if (err) {
//         console.log("query error", err.message);
//     } else {
//         console.log("result", result.rows);
//     }
// };
// let clientConnectionCallback = (err) => {
//     if (err) {
//         console.log("error", err.message);
//     }
//     let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";
//     const values = ["hello"];
//     client.query(text, values, queryDoneCallback);
// };
// client.connect(clientConnectionCallback);