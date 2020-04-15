const log = console.log;
const pool = require('./db/pool');
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
// const prompt = require('./utils/prompts');
const DB = require('./db/db')
// const {TodoList, TodoItem} = require('./todo');

const TAG_LINE = 'DO IT !'
let todoList;

const displayWelcomeText = () => {
  const options = { font: 'Star Wars', horizontalLayout: 'full' }
  log(chalk.blueBright(figlet.textSync(TAG_LINE,options)))
}

const init = () => {
  clear();
  const db = new DB()
}

const run = async () => {
  init();
}

run();