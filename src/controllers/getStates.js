import connection from '../database.js';

const getStates = async (req, res) => {
  try {
    const result = await connection.query(`
      SELECT * FROM states
    `);

    return res.status(200).send(result.rows);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getStates;
