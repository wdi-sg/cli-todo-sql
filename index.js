// Setup

const pg = require('pg');

const configs = {
    user: 'khyreerusydi',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const commandType = process.argv[2];
const userInput = process.argv[3];

const client = new pg.Client(configs);

// function declarations
const show = () => {

    let queryString = "select * from items order by id";

    client.query(queryString, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            console.log(`
Your list of items to do:
                `);

            result.rows.forEach((item, index) => {
                let date = item.created_at.getDate();
                let month = item.created_at.getMonth();
                let year = item.created_at.getFullYear();
                // console.log(typeof date);
                let symbol = item.completed ? "X" : " ";
                console.log(`${index+1}. [${symbol}] - ${item.name}\n   created on: ${date}/${month}/${year}`);
            });

            process.exit();
        }
    });
}

const add = () => {

    let queryString = "insert into items (name, completed) values ($1, $2)";

    let values = [userInput, false];

    client.query(queryString, values, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            show();
        }
    });
}

const done = () => {
    let queryString = "select id, completed from items order by id";

    client.query(queryString, (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            let arrayIndex = (parseInt(userInput)-1);
            let item = result.rows[arrayIndex];
            let action = !item.completed;

            queryString = "update items set completed="+ action +" where id="+item.id;

            client.query(queryString, (err, result) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    show();
                }
            });
        }
    })
}

const del = () => {
    let queryString = "select id from items";

    client.query(queryString, (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            let arrayIndex = (parseInt(userInput)-1);
            let actualIndex = result.rows[arrayIndex].id;

            queryString = "delete from items where id="+actualIndex;

            client.query(queryString, (err, result) => {
                if (err) {
                    console.log("query error", err.message);
                } else {
                    show();
                }
            });
        }
    })
}

// On user connect
client.connect((err)=>{
    if( err ){
        console.log( "error", err.message );
    } else {
        switch(commandType) {
            case "show":
                show();
                break;
            case "add":
                add();
                break;
            case "done":
                done();
                break;
            case "del":
                del();
                break;
            default:
                    console.log(`
Welcome to your Todo List.

Commands available:

show : shows current todo list           [ node index.js show             ]
add  : creates new list items            [ node index.js add "boil water" ]
done : toggle list item as completed     [ node index.js done 2           ]
del  : deletes list item                 [ node index.js del  1           ]
`);
                    process.exit();
        }
    }
});