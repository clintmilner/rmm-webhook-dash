const fakeData = [{"hostname":"🌮 CLINT-PC","deviceId":"247393","siteId":"2590","siteName":"Colorado","msg":"Process 'firefox' isRunning","category":"PROCESS","priority":"low","date":1643886943346,"_id":"f153772630dc4b7b859c1d0ac9cfd213"},{"hostname":"CLINT-PC","deviceId":"247393","siteId":"2590","siteName":"Colorado","msg":"Process 'firefox' isRunning","category":"PROCESS","priority":"low","date":1643887723204,"_id":"0af88291286c43f4a3a39ebb26308075"}]

exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify(fakeData)
    }
}