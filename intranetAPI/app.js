const express = require('express');
const { connectToDb } = require("./config/db");

const app = express();
const PORT = 3000;

connectToDb().then(pool => {
    app.get("/", async (req, res) => {
        try {
            const result = await pool.request().query("SELECT TOP 5 * FROM dbo.ADVERTENCIA");
            res.json(result.recordset);
        } catch (error) {
            res.status(500).json({ error: "Error consultando la base de datos" });
        }
    });
});


app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});