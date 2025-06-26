const db = require('../config/db');

const getPaginatedEmails = async (limit, offset) => {
  const [rows] = await db.query(
    'SELECT * FROM EmailSolicitud LIMIT ? OFFSET ?',
    [limit, offset]
  );
  return rows;
};

const getEmailCount = async () => {
  const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM EmailSolicitud');
  return total;
};

const getEmailById = async (id) => {
  const [rows] = await db.query('SELECT * FROM EmailSolicitud WHERE id = ?', [id]);
  return rows[0];
};

const getSolicitudById = async (id) => {
  const [rows] = await db.query('SELECT * FROM Solicitud WHERE id = ?', [id]);
  return rows[0];
};

module.exports = {
  getPaginatedEmails,
  getEmailCount,
  getEmailById,
  getSolicitudById,
};
