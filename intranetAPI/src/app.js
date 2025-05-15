const express = require('express');
const { connectToDb } = require("./config/db");

const app = express();
const PORT = 18000;
const HOST = "172.16.14.26";

connectToDb().then(pool => {
    app.get("/", async (req, res) => {
        try {
            const result = await pool.request().query("SELECT TOP 5 * FROM dbo.USUARIOS");
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: "Error consultando la base de datos" });
        }
    });
});

