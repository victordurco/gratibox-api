/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */

import connection from '../database.js';

const getUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      res.sendStatus(401);
      return;
    }

    const userQuery = await connection.query(
      `
        SELECT
          users.*
        FROM users
          JOIN sessions
            ON users.id = sessions.user_id
        WHERE sessions.token = $1`,
      [token]
    );

    const user = userQuery.rows[0];

    if (!user) {
      return res.sendStatus(401);
    }

    return res.status(200).send({
      name: user.name,
      id: user.id,
    });
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default getUser;
