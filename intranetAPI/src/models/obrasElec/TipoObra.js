const { connectToAlum, sql } = require('../../config/db');

exports.getAll = async () => {
    const pool = await connectToAlum();
    const result = await pool.request().query(`
        SELECT TOE_ID, TOE_ABREVIATURA, TOE_DESCRIPCION, TOE_INTERNO
        FROM TIPO_OBRA_ELECTRICA
        ORDER BY TOE_ID DESC
    `);
    return result.recordset;
};

exports.findById = async (id) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`SELECT * FROM TIPO_OBRA_ELECTRICA WHERE TOE_ID = @id`);
    return result.recordset[0];
};

exports.findByAbreviatura = async (abreviatura) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('abreviatura', sql.VarChar, abreviatura)
        .query(`SELECT * FROM TIPO_OBRA_ELECTRICA WHERE TOE_ABREVIATURA = @abreviatura`);
    return result.recordset[0];
};

exports.findAbreviaturaDuplicate = async (abreviatura, id) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('abreviatura', sql.VarChar, abreviatura)
        .input('id', sql.Int, id)
        .query(`
            SELECT TOE_ID FROM TIPO_OBRA_ELECTRICA
            WHERE TOE_ABREVIATURA = @abreviatura AND TOE_ID <> @id
        `);
    return result.recordset.length > 0;
};

exports.create = async ({ abreviatura, descripcion, interno }) => {
    const pool = await connectToAlum();
    await pool.request()
        .input('abreviatura', sql.VarChar, abreviatura)
        .input('descripcion', sql.VarChar, descripcion)
        .input('interno', sql.Char, interno)
        .query(`
            INSERT INTO TIPO_OBRA_ELECTRICA (TOE_ABREVIATURA, TOE_DESCRIPCION, TOE_INTERNO)
            VALUES (@abreviatura, @descripcion, @interno)
        `);
};

exports.update = async (id, { abreviatura, descripcion, interno }) => {
    const pool = await connectToAlum();
    await pool.request()
        .input('id', sql.Int, id)
        .input('abreviatura', sql.VarChar, abreviatura)
        .input('descripcion', sql.VarChar, descripcion)
        .input('interno', sql.Char, interno)
        .query(`
            UPDATE TIPO_OBRA_ELECTRICA
            SET TOE_ABREVIATURA = @abreviatura,
                TOE_DESCRIPCION = @descripcion,
                TOE_INTERNO = @interno
            WHERE TOE_ID = @id
        `);
};

exports.remove = async (id) => {
    const pool = await connectToAlum();
    const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`DELETE FROM TIPO_OBRA_ELECTRICA WHERE TOE_ID = @id`);
    return result.rowsAffected[0];
};

