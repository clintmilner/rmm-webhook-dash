
exports.handler = async (event, context) => {
    const diskdb = require('diskdb')
    const dbPath = './src/db'
    const data = diskdb.connect(dbPath, ['alerts'])
    const alerts = await data.alerts.find()
    return {
        statusCode: 200,
        body: JSON.stringify(alerts)
    }
}