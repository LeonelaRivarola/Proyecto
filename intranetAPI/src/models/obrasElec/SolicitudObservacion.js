// models/SolicitudObservacion.js
const db = require('../db');
const moment = require('moment');

class SolicitudObservacion {
  static async findAll() {
    const pool = await db;
    const result = await pool.request()
      .query('SELECT * FROM dbo.SOLICITUD_OBSERVACION');
    return result.recordset.map(this.#formatFecha);
  }

  static async findById(id) {
    const pool = await db;
    const result = await pool.request()
      .input('SOB_ID', id)
      .query('SELECT * FROM dbo.SOLICITUD_OBSERVACION WHERE SOB_ID = @SOB_ID');
    const row = result.recordset[0];
    return row ? this.#formatFecha(row) : null;
  }

  static async create(data) {
    const pool = await db;
    const result = await pool.request()
      .input('SOB_SES_ID', data.SOB_SES_ID)
      .input('SOB_OBSERVACION_ID', data.SOB_OBSERVACION_ID)
      .input('SOB_USUARIO', data.SOB_USUARIO)
      .input('SOB_FECHA', data.SOB_FECHA)
      .query(`
        INSERT INTO dbo.SOLICITUD_OBSERVACION (SOB_SES_ID, SOB_OBSERVACION_ID, SOB_USUARIO, SOB_FECHA)
        OUTPUT INSERTED.*
        VALUES (@SOB_SES_ID, @SOB_OBSERVACION_ID, @SOB_USUARIO, @SOB_FECHA)
      `);
    return this.#formatFecha(result.recordset[0]);
  }

  static async findBySolicitudEstadoId(sesId) {
    const pool = await db;
    const result = await pool.request()
      .input('SES_ID', sesId)
      .query(`
        SELECT * FROM dbo.SOLICITUD_OBSERVACION
        WHERE SOB_SES_ID = @SES_ID
      `);
    return result.recordset.map(this.#formatFecha);
  }

  static async findUltimaBySolicitudEstadoId(sesId) {
    const pool = await db;
    const result = await pool.request()
      .input('SES_ID', sesId)
      .query(`
        SELECT TOP 1 * FROM dbo.SOLICITUD_OBSERVACION
        WHERE SOB_SES_ID = @SES_ID
        ORDER BY SOB_FECHA DESC
      `);
    return result.recordset[0] ? this.#formatFecha(result.recordset[0]) : null;
  }

  // 🔁 Conversión de fecha como Carbon
  static #formatFecha(row) {
    if (row.SOB_FECHA) {
      row.SOB_FECHA = moment(row.SOB_FECHA).format('DD-MM-YYYY');
    }
    return row;
  }
}

module.exports = SolicitudObservacion;
