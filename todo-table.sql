/*psql -d todo -U zachariah -f todo-table.sql*/

CREATE TABLE IF NOT EXISTS to_do_items (
	id serial PRIMARY KEY,
	time_stamp VARCHAR (30) NOT NULL,
	updated_time_stamp VARCHAR (30),
	item VARCHAR (50) NOT NULL,
	done boolean
);