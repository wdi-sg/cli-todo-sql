
class TodoList {

  constructor(dataSource) {
    this.dataSource = dataSource
  }

  async getTodoItems() {
    const data = await this._getData();
    return this.deSerializeJson(data)
  }

  async _getData () {
    return this.dataSource
      .fetchToDoData()
      .catch(e=>console.error(e))
  }

  async deSerializeJson(arr) {
    const todoItems = arr.map(rawObj=> {
      return Object.create(TodoItem.prototype,
        Object.getOwnPropertyDescriptors(rawObj))
    })
    return todoItems
  }

  add(todoItem) {

  }
  //
  // add(todoItem) {
  //
  //   this.list.then(
  //
  //   )
  // }
  //
  // getItemById(id) {
  //   return this.list.find(item => item.id === id);
  // }
  //
  // markAllIncomplete() {
  //   this.list.forEach(item => {
  //     item.markAsIncomplete();
  //   });
  // }
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
  // //   files.save(this.list).then(r => console.log("file saved")).catch(e => console.log(e));
  // // }

}

class TodoItem {

  static _numInstances = 0;

  constructor(content) {
    this._id = 0
    this.title = content;
    this.created_at = new Date();
    this.is_done = false;
  }

  toggleDone() {
    this.is_done ? this.is_done = false : this.is_done = true;
    return this.is_done;
  }

  get id() {
    return this._id;
  }


  markAsDone() {
    this.is_done = true;
  }

  markAsIncomplete() {
    this.is_done = false;
  }
}

module.exports = {
  TodoList,
  TodoItem
};

