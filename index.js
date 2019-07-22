// Setup

const pg = require('pg');

const configs = {
    user: 'khyreerusydi',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const commandType = process.argv[2];
const userInput = process.argv[3]

const client = new pg.Client(configs);

// function declarations
const show = () => {
    client.connect((err)=>{
        if( err ){
            console.log( "error", err.message );
        }

        let queryString = "select * from items";

        client.query(queryString, (err, result) => {
            if (err) {
              console.log("query error", err.message);
            } else {
                console.log(`
Your list of items to do:
                    `);

                result.rows.forEach((item, index) => {
                    if (item.done) {
                        console.log(`${index+1}. [X] - ${item.name}`);
                    } else {
                        console.log(`${index+1}. [ ] - ${item.name}`);
                    }
                });

                process.exit();
            }
        });
    });
}

// default
switch(commandType) {
    case "show":
        show();
        break;
    default:
            console.log(`
Welcome to your Todo List.

Commands available:

show : shows current todo list           [ node index.js show             ]
add  : creates new list items            [ node index.js add "boil water" ]
done : marks list item as completed      [ node index.js done 2           ]
del  : deletes list item                 [ node index.js del  1           ]
`);
}