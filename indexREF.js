console.log("works!!", process.argv[2]);

const pg = require('pg');

const configs = {
    user: 'akira',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);



const menuArr = [ 'Add Task', 'Show All Tasks', 'Mark As Done', 'Unmark An Task', 'Delete A Task' ];

const commandType = parseInt( process.argv[ 2 ] );
const parameter = process.argv[ 3 ];

let loadFrontPage = function() {
    let appTitle = `  ___  __    __    ____  __       ____   __     __    __  ____  ____
 / __)(  )  (  )  (_  _)/  \\  ___(    \\ /  \\   (  )  (  )/ ___)(_  _)
( (__ / (_/\\ )(     )( (  O )(___)) D ((  O )  / (_/\\ )( \\___ \\  )(
 \\___)\\____/(__)   (__) \\__/     (____/ \\__/   \\____/(__)(____/ (__) \n`;
    let menu = "";
    for ( let i = 0; i < menuArr.length; i++ ) {
        menu += `(${i+1}) ${menuArr[i]} \n`;
    }
    console.log( appTitle );
    console.log( menu );
    console.log( Date() );
}

let dateStamp = function() {
    let date = new Date();
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

function AddTask( taskDescription, completedBoolean, dateCreated, dateCompleted ) {
    this.taskDescription = taskDescription;
    this.completedBoolean = completedBoolean;
    this.dateCreated = dateCreated;
    this.dateCompleted = dateCompleted;
}

let addNewTask = function() {
    let newTask = new AddTask( parameter, false, dateStamp(), "" );

let newTask = 'INSERT INTO students (name, phone, email) VALUES ($1, $2, $3) RETURNING id';
const values = ["chee kean", "63723625", "ck@ga.co"];


    jsonfile.readFile( file, ( err, obj ) => {
        if ( err ) {
            console.log( `ERROR DETECTED WHILE READING: ${err}` );
        } else {
            console.log( 'Pushing object into an array' );
            obj[ 'tasks' ].push( newTask );
        }
        jsonfile.writeFile( file, obj, ( err ) => {
            if ( err ) {
                console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
            } else {
                console.log( `Write Operation Completed` );
            }

        } );
    } );
}

let showAllTasks = function() {
    jsonfile.readFile( file, ( err, obj ) => {
        obj[ "tasks" ].forEach( ( taskObj, index ) => {
            let check = taskObj[ "completedBoolean" ] ? "X" : " ";
            console.log( `${index+1}. [${check}] - ${taskObj["taskDescription"]}, Date Created: \x1b[36m${taskObj["dateCreated"]}\x1b[0m, Date Completed: \x1b[31m${taskObj["dateCompleted"]}\x1b[0m` );
        } )
    } );
}

let markTaskDone = function( index ) {
    jsonfile.readFile( file, ( err, obj ) => {
        if ( index > 0 && index <= obj[ "tasks" ].length ) {
            obj[ "tasks" ][ index - 1 ][ "completedBoolean" ] = true;
            obj[ "tasks" ][ index - 1 ][ "dateCompleted" ] = dateStamp();
            jsonfile.writeFile( file, obj, ( err ) => {
                if ( err ) {
                    console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
                } else {
                    console.log( `Mark As Done Completed` );
                }
            } );
        }
    } );
}

let unmarkTask = function( index ) {
    jsonfile.readFile( file, ( err, obj ) => {
        if ( index > 0 && index <= obj[ "tasks" ].length ) {
            obj[ "tasks" ][ index - 1 ][ "completedBoolean" ] = false;
            obj[ "tasks" ][ index - 1 ][ "dateCompleted" ] = "";
            jsonfile.writeFile( file, obj, ( err ) => {
                if ( err ) {
                    console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
                } else {
                    console.log( `Unmark Task Completed` );
                }
            } );
        }
    } );
}

let deleteTask = function( index ) {
    jsonfile.readFile( file, ( err, obj ) => {
        if ( index > 0 && index <= obj[ "tasks" ].length ) {
            obj[ "tasks" ].splice( index - 1, 1 );
        }
        jsonfile.writeFile( file, obj, ( err ) => {
            if ( err ) {
                console.log( `ERROR DETECTED WHILE WRITING: ${err}` );
            } else {
                console.log( `Delete Operation Completed` );
            }
        } );
    } );
}

if ( commandType <= menuArr.length ) {
    console.log( "Echo master's command: " + menuArr[ commandType - 1 ] );
    if ( commandType === 1 && parameter ) {
        addNewTask();
    } else if ( commandType === 2 ) {
        showAllTasks();
    } else if ( commandType === 3 ) {
        markTaskDone( parameter )
    } else if ( commandType === 4 ) {
        unmarkTask( parameter )
    } else if ( commandType === 5 ) {
        if ( parameter > 0 ) {
            deleteTask( parameter );
        }
    }
} else {
    loadFrontPage();
}
































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
  }

  let text = "INSERT INTO todo (name) VALUES ($1) RETURNING id";

  const values = ["hello"];

  client.query(text, values, queryDoneCallback);
};

client.connect(clientConnectionCallback);