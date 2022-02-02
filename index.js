const express = require('express')
const bodyParser = require("body-parser")
const diskdb = require('diskdb');
const app = express()

const PORT = process.env.PORT || 9000

diskdb.connect('./db', ['alerts']);

app.use(bodyParser.json())
app.post("/hook", (req, res) => {
    const {hostname, deviceId, msg, category} = req?.body

    // validate the data is good
    if(!hostname || !deviceId){
        res.status(400).end()
    }

    const now = Date.now()
    const alert = {hostname, deviceId, msg, category, date:now}

    // save the data somewhere
    diskdb.connect('./db', ['alerts']);
    diskdb.alerts.save(alert);
    res.status(200).end()
})

app.get('/', (req, res) => {
    const data = diskdb.connect('./db', ['alerts'])
    const alerts = data.alerts.find()
    res.send(JSON.stringify(alerts))
})

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))