const diskdb = require("diskdb");

exports.handler = async (event, context) => {
    try {
        const diskdb = require('diskdb')
        const dbPath = './functions/db'
        const data = diskdb.connect(dbPath, ['alerts'])
        const alerts = await data.alerts.find()

        return {
            statusCode: 200,
            body: JSON.stringify(alerts)
        }
    } catch (e) {
        return {
            statusCode: 501,
            body: JSON.stringify(e)
        }
    }
}