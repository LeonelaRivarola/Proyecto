const express = require('express');
const { connection } = require("./config/db.js");

const app = express();
const PORT = 18001;
const HOST = "172.16.14.210"; //26 es la otra pc

app.get("/", (req, res) => {
    connection.query("SELECT * FROM USUARIOS LIMIT 5", (err, results) => {
        if (err) {
            res.status(500).json({ error: "Error consultando la base de datos" });
        } else {
            res.json(results);
        }
    });
});

app.listen(PORT, HOST, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});
