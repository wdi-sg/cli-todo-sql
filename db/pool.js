const {Pool , Client } = require('pg')
const pool = new Pool();

const handleErr = (err,client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
}

pool.on('error', handleErr)

module.exports = pool
