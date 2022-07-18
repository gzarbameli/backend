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
/*
connection.query('SHOW TABLES', function (error, results, fields) {
    if (error) throw error;
        console.log(results);
       });



connection.query('CREATE TABLE IF NOT EXISTS reservations (idreservation INT NOT NULL AUTO_INCREMENT,matricula INT NOT NULL, date DATE NOT NULL, starting_time TIME(0) NOT NULL, ending_time TIME(0) NOT NULL, idclassroom INT NOT NULL, PRIMARY KEY (idreservation), FOREIGN KEY (matricula) REFERENCES student(matricula), FOREIGN KEY (idclassroom) REFERENCES classroom(idclassroom),CHECK(starting_time<ending_time))', function (error, results, fields) {
    if (error) throw error;
        console.log(results);
       });/*

       connection.query('CREATE TABLE IF NOT EXISTS student (matricula INT NOT NULL, name VARCHAR(20) NOT NULL,surname VARCHAR(20) NOT NULL, password VARCHAR(20) NOT NULL, PRIMARY KEY (matricula))', function (error, results, fields) {
    if (error) throw error;
            console.log(results);
           });



connection.query("INSERT INTO reservations (matricula,date,starting_time,ending_time,idclassroom) VALUES('198675','2022-11-23','10:00:00','11:00:00','6')", function (error, results, fields) {
        if (error) throw error;
            console.log(results);
           });*/
/*
          connection.query('DROP TABLE reservations', function (error, results, fields) {
            if (error) throw error;
                console.log(results);
               });*/
       //-------------------------------------------------

function fibo(num) {
    var a = 1, b = 0, temp

    while (num >= 0){
        temp = a
        a = a + b
        b = temp
        num--
    }

    return b
}

app.get("/home", cors(), async (request, response) => {
    let num = parseInt(request.headers.fibo);
    console.log(num)
    response.send(`${fibo(num)}`);
})

app.post("/post_name", async (request, response) => {
    let { name } = request.body
    console.log(name)
})

app.use('/login', (request, response) => {
    // Capture the input fields
    global.matricula = request.body.matricula;
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


app.use('/book', (request, response) => {
    // Capture the input fields
    let classroom = request.body.classroom;
    let date = request.body.date;
    let time_s=request.body.time_s
    let time_e=request.body.time_e

    // Ensure the input fields exists and are not empty
    if (classroom && date && time_s  && time_e) {

        function get_info( callback){
                    connection.query('SELECT idclassroom FROM classroom WHERE name= ?', classroom, function(err, results){
                  if (err){ 
                    throw err;
                  }
                  console.log(results[0].idclassroom); 
                  idclassroom = results[0].idclassroom;
      
                  return callback(results[0].idclassroom);
                 }) }
      
      
        var idclassroom = '';
        get_info( function(result){
            idclassroom = result;
           
            connection.query("INSERT INTO reservations (matricula,date,starting_time,ending_time,idclassroom) VALUES(?,?,?,?,?)", [matricula,date,time_s,time_e,idclassroom], function (error, results, fields) {
            // If there is an issue with the query, output the error
            if (error) throw error;
            console.log(results) 
            console.log("correct")
            });


    connection.query('SELECT * FROM reservations', function (error, results, fields) {
        if (error) throw error;
            console.log(results);

           });
}); };
    response.status(200)
});

app.use(cors());

app.use('/myreservations', (req, res) => {
  connection.query('SELECT * FROM reservations WHERE matricula= ?', matricula, (err, results, fields) => {
    if(err) throw err;
    res.send(results);
  });
});




app.listen(port, "0.0.0.0", () => {
    console.log("Server Started...")
})
