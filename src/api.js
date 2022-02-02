const express = require('express')
const serverless = require('serverless-http')
const bodyParser = require("body-parser")
const diskdb = require('diskdb')
const cors = require('cors')
const app = express()
const router = express.Router()

const PORT = process.env.PORT || 3333
const dbPath = './src/db'

app.use(cors())

// const allowedDomains = ['http://localhost','https://rmmbuilds-review-fixwebhooks.sandbox.rmm.datto.com','https://sandboxrmm.centrastage.net','https://clintmilner.github.io/rmm-webhook-dash']
// const corsOptions = {
//     origin:  (origin, callback) => {
//         if (allowedDomains.includes(origin)) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     }
// }


diskdb.connect(dbPath, ['alerts']);

app.use(cors())
app.use(bodyParser.json())
router.post("/hook",  (req, res) => {
    const {hostname, deviceId, msg, category} = req?.body

    // validate the data is good
    if(!hostname || !deviceId){
        res.status(400).end()
    }

    const now = Date.now()
    const alert = {hostname, deviceId, msg, category, date:now}

    // save the data somewhere
    diskdb.connect(dbPath, ['alerts']);
    diskdb.alerts.save(alert);
    res.status(200).end()
})

router.get('/', (req, res) => {
    const data = diskdb.connect(dbPath, ['alerts'])
    const alerts = data.alerts.find()
    res.json(alerts)
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))

app.use('/.netlify/functions/api', router)

module.exports.handler = serverless(app)