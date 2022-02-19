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
    .query(
      q.Map(
        q.Paginate(q.Match(q.Index('all_webhook_alerts'))),
        q.Lambda('x', q.Get(q.Var('x'))),
      ),
    )
    .then(ret => {
      const data = ret?.data.map(alert => q.Get(q.Ref(alert)))

      return {
        statusCode: 200,
        body: JSON.stringify(data),
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
