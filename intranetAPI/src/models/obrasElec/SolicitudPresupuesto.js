// models/SolicitudPresupuesto.js
const db = require('../db');
const moment = require('moment');

class SolicitudPresupuesto {
  static async findAll() {
    const pool = await db;
    const result = await pool.request()
      .query('SELECT * FROM dbo.SOLICITUD_PRESUPUESTO');
    return result.recordset.map(this.#formatFecha);
  }

  static async findById(id) {
    const pool = await db;
    const result = await pool.request()
      .input('SPR_ID', id)
      .query('SELECT * FROM dbo.SOLICITUD_PRESUPUESTO WHERE SPR_ID = @SPR_ID');
    const row = result.recordset[0];
    return row ? this.#formatFecha(row) : null;
  }

  static async create(data) {
    const pool = await db;
    const result = await pool.request()
      .input('SPR_SOLICITUD_ID', data.SPR_SOLICITUD_ID)
      .input('SPR_PRESUPUESTO_ID', data.SPR_PRESUPUESTO_ID)
      .input('SPR_USUARIO', data.SPR_USUARIO)
      .input('SPR_FECHA', data.SPR_FECHA)
      .query(`
        INSERT INTO dbo.SOLICITUD_PRESUPUESTO (SPR_SOLICITUD_ID, SPR_PRESUPUESTO_ID, SPR_USUARIO, SPR_FECHA)
        OUTPUT INSERTED.*
        VALUES (@SPR_SOLICITUD_ID, @SPR_PRESUPUESTO_ID, @SPR_USUARIO, @SPR_FECHA)
      `);
    return this.#formatFecha(result.recordset[0]);
  }

  static async findByPresupuestoId(psoId) {
    const pool = await db;
    const result = await pool.request()
      .input('PSO_ID', psoId)
      .query(`
        SELECT * FROM dbo.SOLICITUD_PRESUPUESTO
        WHERE SPR_PRESUPUESTO_ID = @PSO_ID
      `);
    return result.recordset.map(this.#formatFecha);
  }

  static async ultimoPresupuesto(psoId) {
    const pool = await db;
    const result = await pool.request()
      .input('PSO_ID', psoId)
      .query(`
        SELECT TOP 1 * FROM dbo.SOLICITUD_PRESUPUESTO
        WHERE SPR_PRESUPUESTO_ID = @PSO_ID
        ORDER BY SPR_FECHA DESC
      `);
    return result.recordset[0] ? this.#formatFecha(result.recordset[0]) : null;
  }

  // 🔁 Formatear fecha como Laravel
  static #formatFecha(row) {
    if (row.SPR_FECHA) {
      row.SPR_FECHA = moment(row.SPR_FECHA).format('DD-MM-YYYY');
    }
    return row;
  }
}

module.exports = SolicitudPresupuesto;
