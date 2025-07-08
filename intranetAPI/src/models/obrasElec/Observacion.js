// models/Observacion.js
const db = require('../../config/db');

class Observacion {
  static async findAll() {
    const pool = await db;
    const result = await pool.request()
      .query('SELECT * FROM dbo.OBSERVACION_SOLICITUD_OBRA');
    return result.recordset;
  }

  static async findById(id) {
    const pool = await db;
    const result = await pool.request()
      .input('OSO_ID', id)
      .query('SELECT * FROM dbo.OBSERVACION_SOLICITUD_OBRA WHERE OSO_ID = @OSO_ID');
    return result.recordset[0];
  }

  static async create(data) {
    const pool = await db;
    const result = await pool.request()
      .input('OSO_DESCRIPCION', data.OSO_DESCRIPCION)
      .query(`
        INSERT INTO dbo.OBSERVACION_SOLICITUD_OBRA (OSO_DESCRIPCION)
        OUTPUT INSERTED.*
        VALUES (@OSO_DESCRIPCION)
      `);
    return result.recordset[0];
  }

  static async getSolicitudObservaciones(observacionId) {
    const pool = await db;
    const result = await pool.request()
      .input('observacionId', observacionId)
      .query(`
        SELECT * FROM dbo.SOLICITUD_OBSERVACION
        WHERE SOB_OBSERVACION_ID = @observacionId
      `);
    return result.recordset;
  }
}

module.exports = Observacion;
