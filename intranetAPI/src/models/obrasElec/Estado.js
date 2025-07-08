// models/Estado.js
const db = require('../../config/db');

class Estado {
  static async findAll() {
    const pool = await db;
    const result = await pool.request()
      .query('SELECT * FROM dbo.ESTADO_SOLICITUD_OBRA');
    return result.recordset;
  }

  static async findById(id) {
    const pool = await db;
    const result = await pool.request()
      .input('ESO_ID', id)
      .query('SELECT * FROM dbo.ESTADO_SOLICITUD_OBRA WHERE ESO_ID = @ESO_ID');
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await db;
    const result = await pool.request()
      .input('ESO_DESCRIPCION', data.ESO_DESCRIPCION)
      .query(`
        INSERT INTO dbo.ESTADO_SOLICITUD_OBRA (ESO_DESCRIPCION)
        OUTPUT INSERTED.*
        VALUES (@ESO_DESCRIPCION)
      `);
    return result.recordset[0];
  }

  static async getSolicitudesEstados(estadoId) {
    const pool = await db;
    const result = await pool.request()
      .input('estadoId', estadoId)
      .query(`
        SELECT * FROM dbo.SOLICITUD_ESTADO
        WHERE SES_ESTADO_ID = @estadoId
      `);
    return result.recordset;
  }
}

module.exports = Estado;
