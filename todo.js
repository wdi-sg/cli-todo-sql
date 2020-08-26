class TodoList {

  constructor (data) {
    this.data = data
    this.todoItems = this.deSerializeJson(data)
  }

  async getTodoItems () {
    return this.todoItems
  }

  async setChecked (checkedIds) {
    this.markAllIncomplete();
    (await this.todoItems)
      .filter(item => checkedIds.includes(item._id))
      .forEach(item => item.markAsDone())
  }

  getItemById (id) {
    return this.todoItems.find(item => item.id === id)
  }

  async markAllIncomplete () {
    (await this.todoItems).forEach(item => {
      item.markAsIncomplete()
    })
  }

  async deSerializeJson (arr) {
    const todoItems = arr.map(rawObj => {
      return Object.create(TodoItem.prototype,
        Object.getOwnPropertyDescriptors(rawObj))
    })
    return todoItems
  }

  // add(todoItem) {
  //
  //   this.list.then(
  //
  //   )
  // }
  //

  //
  // remove(id) {
  //   const indexOfItemToRemove = this.list.findIndex(item => item.id === id);
  //   this.list.splice(indexOfItemToRemove, 1);
  // }
  //
  // markAsDone(arrIndex) {
  //   this.list[arrIndex].markAsDone();
  // }
  //
  // markAsIncomplete(arrIndex) {
  //   this.list[arrIndex].markAsIncomplete();
  // }
  //
  // getTodoList() {
  //   return this.list;
  // }
  //
  // toJson() {
  //   return this.list;
  // }
  //
  // // save() {
  // //   files.save(this.list)
  //      .then(r => console.log("file saved"))
  //      .catch(e => console.log(e));
  // // }

}

class TodoItem {
  static _numInstances = 0

  constructor (content) {
    this._id = -1
    this.title = content
    this.created_at = new Date()
    this.is_done = false
  }

  get id () {
    return this._id
  }

  toggleDone () {
    this.is_done ? this.is_done = false : this.is_done = true
    return this.is_done
  }

  markAsDone () {
    this.is_done = true
  }

  markAsIncomplete () {
    this.is_done = false
  }

}

module.exports = {
  TodoList,
  TodoItem
}

