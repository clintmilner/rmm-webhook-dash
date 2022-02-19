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

  console.log(alert)

  return {
    statusCode: 200,
  }
  // const faunadb = require('faunadb')
  // const q = faunadb.query
  // const client = new faunadb.Client({
  //     secret: process.env.FAUNADB_SERVER_SECRET,
  //     domain: 'db.eu.fauna.com',
  //     port: 443,
  //     scheme: 'https',
  // })

  // return client
  //     .query(
  //         q.Map(
  //             q.Paginate(q.Match(q.Index('all_webhook_alerts'))),
  //             q.Lambda('x', q.Get(q.Var('x'))),
  //         ),
  //     )
  //     .then(ret => {
  //         const data = ret?.data.map(alert => q.Get(q.Ref(alert)))
  //
  //         return {
  //             statusCode: 200,
  //             body: JSON.stringify(data),
  //         }
  //     })
  //     .catch(err => {
  //         console.error(
  //             'Error: [%s] %s: %s',
  //             err.name,
  //             err.message,
  //             err.errors()[0].description,
  //         )
  //
  //         return {
  //             statusCode: 500,
  //             body: JSON.stringify(err),
  //         }
  //     })
}
