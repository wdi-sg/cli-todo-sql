
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
			console.log("result: ", res.rows); 
		};
	})
}


client.connect((err) => {

	console.log("Starting PSQL");

// 	let text = "SELECT * FROM students";
	let command = (process.argv[2]).toUpperCase();
	let task = process.argv[3];
	let update = process.argv[4];

	let text = "";

	switch (command) {

		case 'SHOWALL':
		    text = "SELECT * FROM tasklist";
		    console.log('All tasks as follows:');
			show(text);
		    break;

		case 'INSERT':
			text = `INSERT INTO tasklist (task) VALUES ('${task}') RETURNING *`;
			console.log('You have added:');
			show(text);
		    break;

		case 'DELETE':
		    text = `DELETE FROM tasklist WHERE task = '${task}' RETURNING *`;
		    console.log('You have deleted');
			show(text);
		    break;

		case 'CLEAR':
		    text = "DELETE FROM tasklist";
			console.log('All tasks cleared');
		    break;

		case 'CHANGE':
			text = `UPDATE tasklist SET task='${update}' WHERE task = '${task}' RETURNING *`;
			console.log('You have changed the following:');
			show(text);
		    break;

		case 'DONE':
			text = `UPDATE tasklist SET status='true' WHERE task = '${task}' RETURNING *`;
			console.log('You have updated the following:');
			show(text);
		    break;

		default:
		    console.log(`Please use 'showall, insert, clear, or delete'`);
		}

});

