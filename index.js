// console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'ishak',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);
const num = process.argv[3];

const banner = `
@@@@@@@   @@@@@@      @@@@@@@    @@@@@@      @@@       @@@   @@@@@@   @@@@@@@
@@@@@@@  @@@@@@@@     @@@@@@@@  @@@@@@@@     @@@       @@@  @@@@@@@   @@@@@@@
  @@!    @@!  @@@     @@!  @@@  @@!  @@@     @@!       @@!  !@@         @@!
  !@!    !@!  @!@     !@!  @!@  !@!  @!@     !@!       !@!  !@!         !@!
  @!!    @!@  !@!     @!@  !@!  @!@  !@!     @!!       !!@  !!@@!!      @!!
  !!!    !@!  !!!     !@!  !!!  !@!  !!!     !!!       !!!   !!@!!!     !!!
  !!:    !!:  !!!     !!:  !!!  !!:  !!!     !!:       !!:       !:!    !!:
  :!:    :!:  !:!     :!:  !:!  :!:  !:!      :!:      :!:      !:!     :!:
   ::    ::::: ::      :::: ::  ::::: ::      :: ::::   ::  :::: ::      ::
   :      : :  :      :: :  :    : :  :      : :: : :  :    :: : :       :`;


var add = () => {

    let queryDoneCallback = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log("result", result.rows );
        }
    };

    let clientConnectionCallback = (err) => {
        if( err ){
            console.log( "error", err.message );
        } else {
            let text = "INSERT INTO items (name) VALUES ($1) RETURNING id, name";   //query INSERT to name, return id and name
            const values = [process.argv[3]];                                       //values refer to VALUE ($1)

            client.query(text, values, queryDoneCallback);                          //callback for query
        }
    };
client.connect(clientConnectionCallback);
}



var show = () => {
console.log(banner);
    let queryDoneCallback = (err, result) => {
        if (err) {
          console.log("query error", err.message);
        } else {
            const length = result.rows.length;
            const items = result.rows;
            //iterate items, if status = false [ ], else if status = true [x]
            for(let i = 0; i < length; i++) {
                if (items[i].status === false) {
                    console.log(items[i].id + ". " + "[ ] - " +items[i].name);
                } else if (items[i].status === true) {
                    console.log(items[i].id + ". " + "[x] - " +items[i].name);
                }
            }
        }
    };

    let clientConnectionCallback = (err) => {
        if( err ){
            console.log( "error", err.message );
        } else {
            let show = "SELECT * FROM items ORDER BY id ASC";

            client.query(show, queryDoneCallback);
        }
    };
client.connect(clientConnectionCallback);
}



var done = () => {
    //query for Update on done item
    let queryUpdateCallback = (err,result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(`Item ${num} done`)
        }
    };
    //query to show the whole list
    let queryDoneCallback = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            const length = result.rows.length;  //get length of array
            const items = result.rows;
            //iterate items, if status = false [ ], else if status = true [x]
            for(let j = 0; j < length; j++) {
                if (items[j].status === false) {
                    console.log(items[j].id + ". " + "[ ] - " +items[j].name);
                } else if (items[j].status === true) {
                    console.log(items[j].id + ". " + "[x] - " +items[j].name);
                }
            }
        }
    };

    let clientConnectionCallback = (err) => {
        if( err ){
            console.log( "error", err.message );
        } else {
            let select = `UPDATE items SET status = TRUE WHERE id = ${num}`;    //set the selected number item status to TRUE
            let show = "SELECT * FROM items ORDER BY id ASC";                   //show everything items table

            client.query(select, queryUpdateCallback);                          //callback for UPDATE query
            client.query(show, queryDoneCallback);                              //callback for SELECT * FROM items query
        }
    };
client.connect(clientConnectionCallback);
}



var del = () => {

    let queryDoneCallback = (err, result) => {
        if (err) {
            console.log("query error", err.message);
        } else {
            console.log(`Delete item ${num}`);
        }
    };

    let clientConnectionCallback = (err) => {
        if( err ){
            console.log( "error", err.message );
        } else {
            let delText = `DELETE from items WHERE id = ${num}`;

            client.query(delText, queryDoneCallback);              //callback for query
        }
    };
client.connect(clientConnectionCallback);
}


//switch case for add,show,done and delete items
switch (process.argv[2]) {
    case "add":
    add ();
    break;
    case "show":
    show();
    break;
    case "done":
    done();
    break;
    case "delete":
    del();
    break;
}