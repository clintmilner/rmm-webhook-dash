exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: JSON.stringify({message: 'api has been hit!'})
    }
}