# cli-todo-sql

![https://i.giphy.com/media/26ufnwz3wDUli7GU0/giphy.webp](https://i.giphy.com/media/26ufnwz3wDUli7GU0/giphy.webp)

Create a commandline todo list app that you can use from your terminal and that will keep track of things you need to do.

### Deliverables:

#### See the list

```
node todo.js show
```

```
1. [ ] - go shopping
2. [ ] - feed dog
3. [ ] - swim practice
4. [ ] - code app
5. [ ] - meet gabriel
```

#### Add to the list

```
node todo.js add "eat bak kut teh"
```

```
1. [ ] - go shopping
2. [ ] - feed dog
3. [ ] - swim practice
4. [ ] - code app
5. [ ] - meet gabriel
6. [ ] - eat bak kut teh
```

#### Getting Started:
Create and install some things:
```
npm init
npm install pg
```

Create the database itself.

First, drop into `psql`:

Create the DB:
```
CREATE DATABASE todo
```

Create a table:
```
CREATE TABLE IF NOT EXISTS items (
  id SERIAL PRIMARY KEY,
  name text
);
```

Now you can start coding the `index.js` file. The one provided has some boilerplate code for you to start.

#### Further:

#### Mark as done

```
node todo.js done 4
```

```
1. [ ] - go shopping
2. [ ] - feed dog
3. [ ] - swim practice
4. [x] - code app
5. [ ] - meet gabriel
6. [ ] - eat bak kut teh
```
Note that you may need to change your table to allow for "completion" of an item.

#### Further:
Add a column named `created_at` with data type date and display the date the item was added. Look ahead in the gitbook for how to format the date type with `pg` library [https://wdi-sg.github.io/gitbook-2019/04-databases/postgres/sql-working.html](https://wdi-sg.github.io/gitbook-2019/04-databases/postgres/sql-working.html)

#### Further:
Add the ability to archive an item. When you archive an item it means it will no longer show in the list.

#### Further:
Add a column named `updated_at` with data type date and display the date the item was marked completed.

#### Further:
`node todo.js stats complete-time` give the average completion time of all items

#### Further:
`node todo.js stats add-time` give the average amount of items added per day.

#### Further:
`node todo.js stats best-worst` gives the item that was completed the fastest and the item that was completed the slowest.

#### Further:
`node todo.js between 1/2/20 1/3/20` gives all the items added between these dates

#### Further:
Add the same as above but for items completed.

#### Further:
Get all the items completed between two dates and sort them by the time it took to complete. You can say ascending or descending order.

Ex. `node todo.js stats between 1/2/20 1/3/20 complete-time asc`

#### Further:
Use an ascii art generator to add style to your app: [http://patorjk.com/software/taag](http://patorjk.com/software/taag) - here you could use the ES6 string interpolation syntax.

#### Further:
There are frameworks to make a completely dynamic command line app. Use a framework to make the app interactive: [https://medium.freecodecamp.org/writing-command-line-applications-in-nodejs-2cf8327eee2](https://medium.freecodecamp.org/writing-command-line-applications-in-nodejs-2cf8327eee2)

##### Notes:

If you are working with dates, try the momentjs npm library.
