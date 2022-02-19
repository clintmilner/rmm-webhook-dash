
exports.handler = (event, context) => {
    const faunadb = require('faunadb')
    const q = faunadb.querynom
    console.log('Function `todo-read-all` invoked')
    /* configure faunaDB Client with our secret */
    const client = new faunadb.Client({
        secret: process.env.FAUNADB_SERVER_SECRET
    })
    console.log('fauna db client init')
    console.log('=========')
    console.log('=========')
    console.log('=========')
    return client.query(q.Paginate(Collection('alerts')))
        .then((response) => {
            const todoRefs = response.data
            console.log('Todo refs', todoRefs)
            console.log(`${todoRefs.length} todos found`)
            // create new query out of todo refs. http://bit.ly/2LG3MLg
            const getAllTodoDataQuery = todoRefs.map((ref) => {
                return q.Get(ref)
            })
            // then query the refs
            return client.query(getAllTodoDataQuery).then((ret) => {
                return {
                    statusCode: 200,
                    body: JSON.stringify(ret)
                }
            })
        }).catch((error) => {
            console.log('error', error)
            return {
                statusCode: 400,
                body: JSON.stringify(error)
            }
        })
}
