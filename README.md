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
Add the ability to permanently delete an item.

#### Further:
Add a column named `updated_at` with data type date and display the date the item was marked completed.

#### Further:
Use an ascii art generator to add style to your app: [http://patorjk.com/software/taag](http://patorjk.com/software/taag) - here you could use the ES6 string interpolation syntax.

#### Further:
There are frameworks to make a completely dynamic command line app. Use a framework to make the app interactive: [https://medium.freecodecamp.org/writing-command-line-applications-in-nodejs-2cf8327eee2](https://medium.freecodecamp.org/writing-command-line-applications-in-nodejs-2cf8327eee2)
