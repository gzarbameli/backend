const express = require('express');
const cors = require('cors');
const app = express();

const port = 5000;

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

//-------------------------------------------------
//AWS DATABASE CONNECTION
var mysql = require('mysql');

var RDS_HOSTNAME = 'reservation-system-db.crfir7tdazou.us-east-1.rds.amazonaws.com'
var RDS_USERNAME = 'admin'
var RDS_PASSWORD = 'progetto_cloud'
var RDS_PORT = '3306'
var DATABASE = 'project'
var connection = mysql.createConnection({
    host: RDS_HOSTNAME,
    user: RDS_USERNAME,
    password: RDS_PASSWORD,
    port: RDS_PORT,
    database: DATABASE,
});

connection.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }

    console.log('Connected to database.');
});
//-------------------------------------------------

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

app.use('/login', (request, response) => {
    // Capture the input fields
    let matricula = request.body.matricula;
    let password = request.body.password;
    // Ensure the input fields exists and are not empty
    if (matricula && password) {
        // Execute SQL query that'll select the account from the database based on the specified matricula and password
        connection.query('SELECT * FROM student WHERE matricula = ? AND password = ?', [matricula, password], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            // If the account exists
            if (results.length > 0) {
                // Authenticate the user
                //request.session.loggedin = true;
                //request.session.matricula = matricula;
                // Redirect to home page
                //response.redirect('/home');
                console.log(results[0].matricula)
                console.log("correct")
                response.send({
                    token: results[0].matricula
                });
            } else {
                //response.send('Incorrect Username and/or Password!');
                console.log("incorrect")
                /*res.send({
                    token: 'correct'
                });*/
            }
            //response.end();
        });
    } else {
        //response.send('Please enter Username and Password!');
        //response.end();
    }
    console.log(request.body)
    /*res.send({
        token: 'test123'
    });*/
});

app.listen(port, "0.0.0.0", () => {
    console.log("Server Started...")
})
