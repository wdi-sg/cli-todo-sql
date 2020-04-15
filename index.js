const pg = require('pg');

const timeStampUtil = require('./util/get-date.js');

const configs = {
    user: 'zachariah',
    host: '127.0.0.1',
    database: 'todo',
    port: 5432,
};

const client = new pg.Client(configs);

//Async/Await IIFE: --> connect -->  query
(async () => {
    try {

        await client.connect(() => {
            console.log('connected');
        });

        //Query, takes callback to manipulate response when displaying data on CLI (see 'show' and 'showmeta' userArgs below)
        const todoQuery = async (queryText, queryValues, cb) => {
            try {
                const res = await client.query(queryText, queryValues);
                if (cb) cb(res);

            } catch (e) {
                console.log('Error! ' + e.message);
            }
        }
        //

        //CLI display for show / showmeta arguments
        const listTitle =
            `
                ╔═╗┌─┐┌─┐┬ ┬┌─┐  ╔╦╗┌─┐  ╔╦╗┌─┐  ╦  ┬┌─┐┌┬┐
                ╔═╝├─┤│  ├─┤└─┐   ║ │ │───║║│ │  ║  │└─┐ │
                ╚═╝┴ ┴└─┘┴ ┴└─┘   ╩ └─┘  ═╩╝└─┘  ╩═╝┴└─┘ ┴
        `
        //

        const userArgs = process.argv.slice(2);

        if (!userArgs[0]) {

            console.log(`Enter "add", "clear", "clearall", "crossoff", "show",  "showmeta", "archive" or "unarchive" followed by appropriate values as arguments`);

        } else {

            console.log(userArgs);

            let queryT;
            let queryV;

            switch (userArgs[0].toLowerCase()) {

                case 'add':

                    if (userArgs[1]) {

                        queryT = 'INSERT INTO to_do_items(time_stamp, item) VALUES ($1, $2) RETURNING *';

                        queryV = [timeStampUtil.getTimeStamp(), userArgs[1]];

                        todoQuery(queryT, queryV);

                    }
                    break;

                case 'clear':

                    queryT = `DELETE FROM to_do_items WHERE item = '${userArgs[1]}' RETURNING *`;
                    console.log(queryT);

                    todoQuery(queryT);

                    break;

                case 'clearall':

                    queryT = 'DELETE FROM to_do_items RETURNING *';

                    todoQuery(queryT);

                    break;

                case 'crossoff':

                    queryT = `UPDATE to_do_items SET done = TRUE, updated_time_stamp ='${timeStampUtil.getTimeStamp()}' WHERE item = '${userArgs[1]}' RETURNING *`;

                    todoQuery(queryT);

                    break;

                case 'show':

                    queryT = 'SELECT id, item, done, archived FROM to_do_items';

                    todoQuery(queryT, "", (res) => {

                        console.log(`${listTitle}\n\n`);

                        res.rows.forEach(obj => {

                            let isItemDone;

                            obj.done ? isItemDone = '[X]' : isItemDone = '[ ]';

                            if (!obj.archived)
                                console.log(`${res.rows.indexOf(obj) + 1}. ${isItemDone} - ${obj.item}`);
                        })
                    });

                    break;

                case 'showmeta':

                    queryT = 'SELECT * FROM to_do_items';

                    todoQuery(queryT, "", (res) => {

                        console.log(`${listTitle}\n\n`);

                        res.rows.forEach(obj => {

                            let isItemDone;
                            let markedDoneInfo = "";

                            if (obj.done) {
                                isItemDone = '[X]';
                                markedDoneInfo = `\nMarked done on ${obj["updated_time_stamp"]}`;
                            } else {
                                isItemDone = '[ ]';
                            }

                            if (!obj.archived)
                                console.log(`${res.rows.indexOf(obj) + 1}. ${isItemDone} - ${obj.item}\n Item added to list on ${obj["time_stamp"]}${markedDoneInfo}`);
                        })
                    });

                case 'archive':

                    queryT = `UPDATE to_do_items SET archived = TRUE WHERE item = '${userArgs[1]}' RETURNING *`;

                    todoQuery(queryT);

                    break;

                case 'unarchive':

                    queryT = `UPDATE to_do_items SET archived = FALSE WHERE item = '${userArgs[1]}' RETURNING *`;

                    todoQuery(queryT);

                    break;

                case 'stats-complete-time':

                    queryT = `SELECT time_stamp, updated_time_stamp FROM to_do_items`;

                    todoQuery(queryT, "", (res) => {

                        //**To get average time completed based on crossoff timestamp and creation timestamp. To consider refactoring to simpler function as presently, am calling reduce twice. To consider storing timestamps in format more conducive for JS manipulation.

                        let timeArray = []

                        const avgTotalMinutes = res.rows
                            .reduce((arr, obj) => {

                                let timeDiff;

                                if (obj["updated_time_stamp"]) {
                                    timeDiff = Math.abs(new Date(obj["updated_time_stamp"].replace(/-/g, '/')) - new Date(obj["time_stamp"].replace(/-/g, '/')));

                                }

                                if (timeDiff) arr.push(timeDiff);
                                return arr;

                            }, timeArray)

                            .reduce((sum, time) => {
                                return sum + time / timeArray.length / 60000;
                            }, 0)

                        console.log('The average time taken to complete a task is ' + avgTotalMinutes.toFixed(2) + ' minutes');
                    });

                    break;

            }
        }

    } catch (e) {
        console.log(e.message);
    }

})();