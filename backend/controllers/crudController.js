const pool = require('../config/db');

// Generic CRUD factory
const createCrudController = (tableName, idColumn, columns) => {
  return {
    // GET all
    getAll: async (req, res) => {
      try {
        const result = await pool.query(`SELECT * FROM "${tableName}" ORDER BY "${idColumn}"`);
        res.json(result.rows);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    },

    // GET by id
    getById: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await pool.query(
          `SELECT * FROM "${tableName}" WHERE "${idColumn}" = $1`,
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    },

    // CREATE
    create: async (req, res) => {
      try {
        const values = columns.map((col) => req.body[col]);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const colNames = columns.map((c) => `"${c}"`).join(', ');

        const result = await pool.query(
          `INSERT INTO "${tableName}" (${colNames}) VALUES (${placeholders}) RETURNING *`,
          values
        );
        res.status(201).json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    },

    // UPDATE
    update: async (req, res) => {
      try {
        const { id } = req.params;
        const setClause = columns
          .map((col, i) => `"${col}" = $${i + 1}`)
          .join(', ');
        const values = columns.map((col) => req.body[col]);
        values.push(id);

        const result = await pool.query(
          `UPDATE "${tableName}" SET ${setClause} WHERE "${idColumn}" = $${columns.length + 1} RETURNING *`,
          values
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json(result.rows[0]);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    },

    // DELETE
    remove: async (req, res) => {
      try {
        const { id } = req.params;
        const result = await pool.query(
          `DELETE FROM "${tableName}" WHERE "${idColumn}" = $1 RETURNING *`,
          [id]
        );
        if (result.rows.length === 0) {
          return res.status(404).json({ error: 'Record not found' });
        }
        res.json({ message: 'Deleted successfully', deleted: result.rows[0] });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    },
  };
};

module.exports = createCrudController;
