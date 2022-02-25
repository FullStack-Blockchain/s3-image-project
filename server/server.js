const express = require('express')
const mysql = require('mysql')
const myconn = require('express-myconnection')

const cors = require('cors')
const app = express()

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());



var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'images'
}))


con.connect(function(err) {
    if (err) throw err;

    if (err) throw err;
    console.log("Connected!");
    con.query("CREATE DATABASE IF NOT EXISTS  images", function (err, result) {
      if (err) throw err;
      console.log("Database created");
    });

    console.log("Connected!");

    con.query("use images")

    var sql = "CREATE TABLE IF NOT EXISTS  image (name varchar(255), s3bucket varchar(255) , s3path varchar(255), timestamp varchar(255))";
    con.query(sql, function (err, result) {
      if (err) throw err;
      console.log("Table created");
    });

  });

app.use(cors())

app.use(require('./routes/routes'))

app.listen(9000, () => {
    console.log('server running on', 'http://localhost:' + 9000)
})


