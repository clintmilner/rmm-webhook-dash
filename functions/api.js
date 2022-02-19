exports.handler = (event, context) => {
  const faunadb = require('faunadb')
  const q = faunadb.query
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
    domain: 'db.eu.fauna.com',
    port: 443,
    scheme: 'https',
  })

  return client
    .query(q.Get(q.Collection('alerts')))
    .then(ret => {
      console.log('anything?', ret)
      return {
        statusCode: 200,
        body: JSON.stringify(ret),
      }
    })
    .catch(err => {
      console.error(
        'Error: [%s] %s: %s',
        err.name,
        err.message,
        err.errors()[0].description,
      )

      return {
        statusCode: 500,
        body: JSON.stringify(err),
      }
    })
}
