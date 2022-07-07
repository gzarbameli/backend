const express = require('express');
const cors = require('cors');
const app = express();

const port = 5000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.get("/home", cors(), async (request, response) => {
    response.send("STRING FROM THE SERVER!!!");
})

app.post("/store-data", (request, response) => {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString(); // convert Buffer to string
    });
    request.on('end', () => {
        console.log(body);
        response.end('ok');
    });
})

app.post("/post_name", async (request, response) => {
    let { name } = request.body
    console.log(name)
})

app.use('/login', (req, res) => {
    console.log(req.body)
    res.send({
        token: 'test123'
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Started...")
})
