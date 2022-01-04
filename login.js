const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const { json } = require("body-parser");
const encoder = bodyParser.urlencoded({ extended: false });
// var popup = require('popups');

const app = express();
app.use("/assets", express.static("assets"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ansh@2002",
  database: "registration",
});

// connect to the database
connection.connect(function (error) {
  if (error) throw error;
  else console.log("connected to the database successfully!");
});

app.set("view engine", "hbs");
app.use("/assets", express.static("assets"));
app.get("/", function (req, res) {
  res.render("index");
});

// app.get("/",function(req,res){
//     res.sendFile(__dirname + "/index.html");
// })

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/", encoder, function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  console.log(email);
  if (email === "aggarwal21@ymail.com" && password === "ansh") {
    connection.query("SELECT * FROM employees", (err, result) => {
      console.log(result);
    
      return res.render("admin", { rows: result });
    });
  }
  connection.query(
    "select * from users where email = ? and password = ?",
    [email, password],
    function (error, results, fields) {
      if (results.length > 0) {
        var a = results.email;
        var b = results.password;
        console.log(a);
        console.log(results);

        return res.render("welcome", {
          emai: `${results[0].name}`,
        });
      } else {
        return res.render("index", {
          login: "Invalid Username & password",
        });
      }

      res.end();
    }
  );
});

app.get("/reg", function (req, res) {
  res.render("register");
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.post("/users", (req, res) => {
  const data = req.body;
  console.log("body --> ", data);
  const insertQuery =
    "INSERT INTO users (name, email,password) VALUES (?, ?,?)";
  connection.query(
    insertQuery,
    [data.name, data.email, data.password],
    (err, rows, fields) => {
      if (!err) {
        console.log("inserted");
        var sql = `CREATE TABLE ${data.name}  (Name VARCHAR(255), Date VARCHAR(255), Attendence VARCHAR(255))`;
        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Table created");
        });
      } else {
        console.log("error", err);
      }
    }
  );
});

app.get("/add-employee", (req, res) => {
  return res.render("add-employee");
});
app.post("/add", (req, res) => {
  const data = req.body;
  console.log("body --> ", data);
  const insertQuery =
    "INSERT INTO employees (Name, Department,Phone) VALUES (?, ?,?)";
  connection.query(
    insertQuery,
    [data.name, data.department, data.phone],
    (err, rows, fields) => {
      if (!err) {
        console.log("inserted");
        connection.query("select id from employees where Name = ? and Department = ? and Phone=? ",[data.name, data.department, data.phone],function (error, results, fields) {
            if (!error) 
            {
              console.log(results[0].id);
              let ab=results[0].id 
              var sq = `CREATE TABLE ${data.name}${ab}  (Name VARCHAR(255), Date VARCHAR(255), Attendence VARCHAR(255))`;
              connection.query(sq, function (err, result) {
                if (err) throw err;
                console.log("Table created");
              });
            } else {
              console.log(error);
            }
          }
        );
      } else console.log(err);
    }
  );
});

// api for attendence
app.post("/present",(req,res)=>{
    console.log("hello from attendence")
    console.log(req.body.present)
    // var dateTime = new Date();
    // console.log(dateTime);
    var date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
   var minutes = date_ob.getMinutes();
   var seconds = date_ob.getSeconds();
  
    var dateTime =  day + "-"+ month + "-" + year + "-" + + hours + ":" + minutes + ":" + seconds;
    console.log(dateTime);

})


// set app port
app.listen(4200);
