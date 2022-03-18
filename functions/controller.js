/**
 *
 {
    "hostname":"[device_hostname]",
    "deviceId":"[device_id]",
    "siteId":"[site_id]",
    "siteName":"[site_name]",
    "priority":"moderate",
    "msg":"[alert_message]",
    "category":"[alert_category]"
  }
 *
 */
exports.handler = (event, context, callback) => {
  const verb = event?.httpMethod

  switch (verb) {
    case 'POST': {
      const faunadb = require('faunadb')
      const q = faunadb.query
      const client = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET,
        domain: 'db.eu.fauna.com',
        port: 443,
        scheme: 'https',
      })
      const body = JSON.parse(event.body)
      const { hostname, deviceId, siteId } = body

      // validate the data is good
      if (!hostname || !deviceId || !siteId) {
        return callback(null, {
          statusCode: 400,
          body: 'Error: request does not contain valid details',
        })
      }

      // successful webhook test
      if (siteId === '[site_id]') {
        return callback(null, {
          statusCode: 200,
          body: 'Webhook test was successful',
        })
      }

      // only accepting data from our site
      if (siteId !== process.env.ALLOWED_SITE_ID) {
        return callback(null, {
          statusCode: 400,
          body: 'Error: alert data is only accepted from certain sites',
        })
      }

      const now = Date.now()
      const alert = { ...body, date: now }

      return client
        .query(q.Create(q.Collection('alerts'), { data: alert }))
        .then(() => {
          return callback(null, {
            statusCode: 200,
            body: 'alert created successfully',
          })
        })
        .catch(err => {
          console.error(
            'Error: [%s] %s: %s',
            err.name,
            err.message,
            err.errors()[0].description,
          )

          return callback(null, {
            statusCode: 500,
            body: JSON.stringify(err),
          })
        })
    }
    case 'GET': {
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
    default: {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: 'unsupported method' }),
      }
    }
  }
}
