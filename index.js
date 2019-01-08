
const pg = require('pg');
//this is after 'npm init' and 'npm i pg'
// const insertion = require('./functions/insertion');

const configs = {
user: 'postgres',
password: 'postgres',
host: '127.0.0.1',
database: 'todolist',
port: 5432,
};

// sudo -u postgres createdb todolist
// psql -d todolist -U postgres -f tables.sql;

const client = new pg.Client(configs);

const show = text => {
	client.query(text,(err, res) => {
		if( err ){
     	console.log( "error", err.message );
    	} else {
			// console.log("result: ", res.rows); 
			for(let i=0; i<res.rows.length; i++) {
				if(res.rows[i].status === true) {
	                console.log((i+1)+". [X] - "+res.rows[i].task+" - Created On: "+res.rows[i].created_at+" - Updated On: "+res.rows[i].updated_at);
	            } else {
	                console.log((i+1)+". [ ] - "+res.rows[i].task+" - Created On: "+res.rows[i].created_at+" - Updated On: "+res.rows[i].updated_at);
            }
			}
		};
	})
}


client.connect((err) => {

	console.log("Starting PSQL");

	if (process.argv[2] == "") {
		process.argv[2] = "undefined";
	}

	let command = (process.argv[2]).toUpperCase();
	let task = process.argv[3];
	let update = process.argv[4];

	let text = "";

	console.log("command: " + command);

	switch (command) {

		case 'SHOWALL':
		    text = "SELECT * FROM tasklist";
		    console.log('All tasks as follows:');
		    break;

		case 'ADD':
			text = `INSERT INTO tasklist (task) VALUES ('${task}') RETURNING *`;
			console.log('You have added:');
		    break;

		case 'DELETE':
		    text = `DELETE FROM tasklist WHERE task = '${task}' RETURNING *`;
		    console.log('You have deleted');
		    break;

		case 'CLEAR':
		    text = "DELETE FROM tasklist";
			console.log('All tasks cleared');
		    break;

		case 'CHANGE':
			text = `UPDATE tasklist SET task='${update}' WHERE task = '${task}' RETURNING *`;
			console.log('You have changed the following:');
		    break;

		case 'DONE':
			text = `UPDATE tasklist SET status='true', updated_at = now() WHERE task = '${task}' RETURNING *`;
			console.log('You have updated the following:');
		    break;

		default:
			text = "SELECT * FROM tasklist";
		    console.log(`Please use 'showall, insert, clear, or delete'`);
		}
	show(text);
});

