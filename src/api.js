const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require('body-parser')
const diskdb = require('diskdb')
const cors = require('cors')
const app = express()
const router = express.Router()
require('dotenv').config()

const PORT = process.env.PORT || 3333

const dbPath = './src/db'
diskdb.connect(dbPath, ['alerts']);

app.use(cors())
app.use(bodyParser.json())

router.post('/hook',  (req, res) => {
    const {hostname, deviceId, siteId} = req?.body

    // validate the data is good
    if(!hostname || !deviceId || !siteId){
        return res.status(400).end()
    }

    // successful webhook test
    if(siteId === '[site_id]') {
        return res.status(200).end()
    }

    // only accepting data from our site
    if(siteId !== process.env.ALLOWED_SITE_ID) {
        return res.status(400).end()
    }


    const now = Date.now()
    const alert = {...req?.body, date:now}

    // save the data somewhere
    diskdb.connect(dbPath, ['alerts']);
    diskdb.alerts.save(alert);
    return res.status(200).end()
})

router.get('/', (req, res) => {
    const data = diskdb.connect(dbPath, ['alerts'])
    const alerts = data.alerts.find()
    return res.json(alerts)
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)