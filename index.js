// Setup

const pg = require('pg');

const configs = {
    user: 'khyreerusydi',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);


const commandType = process.argv[2];
const userInput = process.argv[3];

const figlet = require('figlet');

let welcome = "\nWelcome to your Todo List.";

figlet('Done?', {
    font: 'Big Money-ne',
    horizontalLayout: 'default',
    verticalLayout: 'default'
}, (err, data) => {
    welcome = data;
});

const commandsList = `
Commands available:

show : shows current todo list           [ node index.js show             ]
add  : creates new list items            [ node index.js add "boil water" ]
done : toggle list item as completed     [ node index.js done 2           ]
del  : deletes list item                 [ node index.js del  1           ]
`;

// function declarations
const show = () => {

    let queryString = "select * from items order by id";

    client.query(queryString, (err, result) => {
        if (err) {
          console.log("query error", err.message);
        }
        else if (!result.rows[0]) {
            console.log("\nYour list is empty!");
            console.log('\nTo add new todo items eg. boil water: [ node index.js add "boil water" ]');
            process.exit();
        }else {
            console.log(`
Your list of items to do:
                `);

            result.rows.forEach((item, index) => {
                let date = `${item.created_at.getDate()} ${item.created_at.toLocaleString('default', { month: 'short' })} ${item.created_at.getFullYear()}`;
                let symbol = item.completed ? "X" : " ";
                let status = item.updated_at ? `${item.updated_at.getDate()} ${item.updated_at.toLocaleString('default', { month: 'short' })} ${item.updated_at.getFullYear()}` : "pending";
                console.log(`${index+1}. [${symbol}] - ${item.name}\n   created on: ${date}\n    completed: ${status}`);
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

            if (item) {
                let action = !item.completed;
                let date = action ? new Date() : null;

                queryString = "update items set updated_at=($1), completed=($2) where id=($3)";
                let values = [date, action, item.id];

                client.query(queryString, values, (err, result) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        show();
                    }
                });
            } else {
                console.log("Please input the correct id number!");
                process.exit();
            }
        }
    })
}

const del = () => {
    let queryString = "select id from items order by id";

    client.query(queryString, (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            let arrayIndex = (parseInt(userInput)-1);
            if (result.rows[arrayIndex]) {
                let actualId = result.rows[arrayIndex].id;

                queryString = "delete from items where id="+actualId;

                client.query(queryString, (err, result) => {
                    if (err) {
                        console.log("query error", err.message);
                    } else {
                        show();
                    }
                });
            } else {
                console.log("Please input the correct id number!");
                process.exit();
            }
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
                console.log();
                console.log(welcome);
                console.log(commandsList);
                process.exit();
        }
    }
});