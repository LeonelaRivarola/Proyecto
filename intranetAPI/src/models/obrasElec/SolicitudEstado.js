// models/SolicitudEstado.js
const db = require('../../config/db');
const moment = require('moment');

class SolicitudEstado {
  static async findAll() {
    const pool = await connectToAlum();
    const result = await pool.request()
      .query('SELECT * FROM dbo.SOLICITUD_ESTADO');
    return result.recordset.map(this.#formatFecha);
  }

  static async findById(id) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_ID', id)
      .query('SELECT * FROM dbo.SOLICITUD_ESTADO WHERE SES_ID = @SES_ID');
    const row = result.recordset[0];
    return row ? this.#formatFecha(row) : null;
  }

  static async create(data) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_SOLICITUD_ID', data.SES_SOLICITUD_ID)
      .input('SES_ESTADO_ID', data.SES_ESTADO_ID)
      .input('SES_USUARIO', data.SES_USUARIO)
      .input('SES_FECHA', data.SES_FECHA)
      .query(`
        INSERT INTO dbo.SOLICITUD_ESTADO (SES_SOLICITUD_ID, SES_ESTADO_ID, SES_USUARIO, SES_FECHA)
        OUTPUT INSERTED.*
        VALUES (@SES_SOLICITUD_ID, @SES_ESTADO_ID, @SES_USUARIO, @SES_FECHA)
      `);
    return this.#formatFecha(result.recordset[0]);
  }

  static async findBySolicitudId(soeId) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_SOLICITUD_ID', soeId)
      .query('SELECT * FROM dbo.SOLICITUD_ESTADO WHERE SES_SOLICITUD_ID = @SES_SOLICITUD_ID');
    return result.recordset.map(this.#formatFecha);
  }

  static async ultimoEstado(soeId) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_SOLICITUD_ID', soeId)
      .query(`
        SELECT TOP 1 * FROM dbo.SOLICITUD_ESTADO
        WHERE SES_SOLICITUD_ID = @SES_SOLICITUD_ID
        ORDER BY SES_FECHA DESC
      `);
    return result.recordset[0] ? this.#formatFecha(result.recordset[0]) : null;
  }

  static async observacionesBySesId(sesId) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_ID', sesId)
      .query(`
        SELECT * FROM dbo.SOLICITUD_OBSERVACION
        WHERE SOB_SES_ID = @SES_ID
      `);
    return result.recordset;
  }

  static async ultimaObservacion(sesId) {
    const pool = await connectToAlum();
    const result = await pool.request()
      .input('SES_ID', sesId)
      .query(`
        SELECT TOP 1 * FROM dbo.SOLICITUD_OBSERVACION
        WHERE SOB_SES_ID = @SES_ID
        ORDER BY SOB_FECHA DESC
      `);
    return result.recordset[0];
  }

  // 🔁 Formato de fecha
  static #formatFecha(row) {
    if (row.SES_FECHA) {
      row.SES_FECHA = moment(row.SES_FECHA).format('DD-MM-YYYY');
    }
    return row;
  }
}

module.exports = SolicitudEstado;
