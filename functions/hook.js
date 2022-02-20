/**
 *
 * {
 *   "hostname":"[device_hostname]",
 *   "deviceId":"[device_id]",
 *   "siteId":"[site_id]",
 *   "siteName":"[device_id]",
 *   "priority":"moderate",
 *   "msg":"[alert_message]",
 *   "category":"[alert_category]"
 * }
 *
 */
exports.handler = event => {
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
    return {
      statusCode: 400,
      body: 'Error: request does not contain valid details',
    }
  }

  // successful webhook test
  if (siteId === '[site_id]') {
    return {
      statusCode: 200,
    }
  }

  // only accepting data from our site
  if (siteId !== process.env.ALLOWED_SITE_ID) {
    return {
      statusCode: 400,
      body: 'Error: data only accepted from certain sites',
    }
  }

  const now = Date.now()
  const alert = { ...body, date: now }


  client
    .query(q.Create(q.Collection('all_webhook_alerts'), { data: alert }))
    .then(ret => ({
      statusCode: 200,
    }))
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
