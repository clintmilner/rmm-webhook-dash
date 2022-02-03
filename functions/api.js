const diskdb = require('diskdb')
const dbPath = './src/db'


exports.handler = async (event, context) => {
    const data = diskdb.connect(dbPath, ['alerts'])
    const alerts = data.alerts.find()
    return {
        statusCode: 200,
        body: JSON.stringify(alerts)
    }
}