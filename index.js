const log = console.log;
const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');
const prompt = require('./utils/prompts');
const DB = require('./db/db')
const {TodoList, TodoItem} = require('./todo');
const TAG_LINE = 'DO IT !'

let todoList;

const init = async () => {
  const db = new DB()
  todoList = new TodoList(db)
}

const displayWelcomeText = () => {
  const options = { font: 'Star Wars', horizontalLayout: 'full' }
  log(chalk.blueBright(figlet.textSync(TAG_LINE,options)))
}

const handleShowTodos = async () => {
  const checkedIdsObj = await prompt.listTodos(todoList.getTodoItems())

}

const addNewTodos = async () => {

}

const getNewTodoInput = async (todosToAdd) => {
  let userInput = await prompt.addTodo();
  todosToAdd.push(userInput.newTodo);
  if (userInput.askAgain) {
    return await getNewTodoInput(todosToAdd)
  } else {
    return todosToAdd
  }
}


const getUserAction = async () => {
  let answer = await prompt.displayMenu();
  if (answer.command === 'view') {
      await handleShowTodos()
  } else if (answer.command === 'add') {
    // await showTodo();
  } else if (answer.command === 'delete') {
    // await deleteTodo();
  } else if (answer.command === 'quit') {
    process.exit(0)
  }
  await getUserAction();
}

const run = async () => {
  init();
  displayWelcomeText()
  await getUserAction()
}

run();