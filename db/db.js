const { Pool } = require('pg')
require('dotenv').config()

class DB {
  constructor () {
    this.pool = new Pool()
    this.dbName = process.env.PGDATABASE
    this.createDbIfNotExist()
    this.createTableIfNotExist()
  }

  createDbIfNotExist () {
    const text = `SELECT EXISTS
    (SELECT datname FROM pg_catalog.pg_database
     WHERE datname ='${this.dbName}');`
    const func = res => {if (!res.rows[0].exists) this.createDB()}
    this.execute(text, undefined, func).catch(e=>console.error(e))
  }

  createDB () {
    const text = `create database ${this.dbName};`
    const func = this.createTableIfNotExist()
    this.execute(text, undefined, func).catch(e=>console.log(e))
  }

  createTableIfNotExist () {
    const text =
      `create table if not exists todo
      ( _id serial
      constraint todo_pk
      primary key,
      title text not null,
      created_at timestamptz default current_timestamp,
      is_done BOOLEAN default false
      );`
    this.execute(text).catch(e=> console.error(e))
  }

  // todo: this should be moved to dbTodo
  async fetchToDoData () {
    const text = `select * from todo;`
    const res = await this.execute(text)
    return res.rows;
  }

  async updateAll(objArr) {
    let objs = await objArr
    objs = objs.filter(item=>item['_id']>=0)
    const actions = objs.map(this.update.bind(this))
    const res = Promise.all(actions)
    return res;
  }

  async update(obj) {
    const id = obj['id'] || obj['_id']
    delete obj.id && delete obj._id
    const fields = Object.keys(obj)
    const vals = Object.values(obj)
    const placeHolers = vals.map((v,i)=>`\$${i+1}`)
    let text = `update todo set (${fields.join(',')}) = (${placeHolers.join()}) `;
        text+= `where _id=${id}`
    return this.execute(text,vals)
  }

  async execute (text, values, func) {
    const client = await this.pool.connect()
    let res
    try {
      if (values) res = await client.query(text, values)
      else res = await client.query(text)
      if (func) return func(res)
      else return res;
    } finally {
      client.release()
    }
  }

}

module.exports = DB


