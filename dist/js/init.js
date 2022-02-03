const init = (msg) => {
    console.log(msg)
    const url = 'https://rmm-webhook-dash.netlify.app/.netlify/functions/api'
    fetch(url)
        .then(response => response.json())
        .then(data => console.log('data returned', data))
        .catch((err) => console.warn('Something went wrong.', err))
}

init(`Welcome and let's go 🚀`)