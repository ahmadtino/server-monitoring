// Dependencies
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

// Panggil express function
const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

// Client settings
app.set('view engine', 'ejs');

// Database connection
const db = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    user: "sql12579202",
    password: "htMYDtrswi",
    database: "sql12579202"
});

db.connect(err => {
    if (err) throw err;
    console.log('Database connected');
});

// API End Point
// 1. Read-Data Fetching API
app.get("/read-all-data", (req, res) => {
    const query = "SELECT * FROM user_list";
    db.query(query, (err, response) => {
        if (err) throw err;
        res.status(200).send(response);
    });
})

// 2. Specific-Data Fetching API
app.get("/read-spec-data/:cred", (req, res) => {
    const cred = req.params.cred;
    const query = "SELECT * FROM user_data WHERE device_cred = ? ORDER BY id";
    db.query(query, cred, (err, response) => {
        if (err) throw err;
        res.status(200).send(response);
    });
})

// 3. Data Storing API
app.post("/post-data", (req, res) => {
    const data = req.body;
    const query = "INSERT INTO user_data (device_cred, v_solar, i_solar, p_solar, pf_solar, e_solar, v_load, i_load, p_load, pf_load, e_load, timestamp) VALUES (?)";
    const date = new Date();
    const values = Object.values(data);
    values.push(date);

    db.query(query, [values], (err, response) => {
        if (err) throw err;
        res.status(200).send({
            message: "Data submitted"
        });
    });
})

// 4. Delete Data API
app.delete("/delete-data/:cred", (req, res) => {
    const cred = req.params.cred;
    const query = "DELETE FROM user_data WHERE device_cred = ?";
    db.query(query, cred, (err, response) => {
        if (err) throw err;
        res.status(200).send({
            message: "Data deleted"
        });
    });
})

// Start server
app.listen(3000, () => console.log("Server started..."));

