// models/Localidad.js
const db = require('../db');

class Localidad {
  static async findAll() {
    const pool = await db;
    const result = await pool.request()
      .query('SELECT * FROM GeaCorpico.dbo.LOCALIDAD');
    return result.recordset;
  }

  static async findById(locId) {
    const pool = await db;
    const result = await pool.request()
      .input('LOC_ID', locId)
      .query('SELECT * FROM GeaCorpico.dbo.LOCALIDAD WHERE LOC_ID = @LOC_ID');
    return result.recordset[0] || null;
  }
}

module.exports = Localidad;
