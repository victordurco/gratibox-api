/* eslint-disable comma-dangle */
import bcrypt from 'bcrypt';
import connection from '../database.js';
import signUpSchema from '../schemas/auth.schemas';

const SignUp = async (req, res) => {
  const { name, email, password } = req.body;

  const validation = signUpSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const checkEmail = await connection.query(
      `
      SELECT * FROM users WHERE users.email = $1
    `,
      [email]
    );

    if (checkEmail.rowCount > 0) {
      return res.sendStatus(409);
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    await connection.query(
      `
    INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
      [name, email, passwordHash]
    );
    return res.sendStatus(201);
  } catch (err) {
    console.error(err);
    return res.sendStatus(500);
  }
};

export default SignUp;
