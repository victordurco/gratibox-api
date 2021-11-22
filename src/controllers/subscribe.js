/* eslint-disable comma-dangle */
import connection from '../database.js';
import subscriptionSchema from '../schemas/subscription.schemas.js';

const Subscribe = async (req, res) => {
  const {
    addressData, products, deliveryDay, planId, userId
  } = req.body;
  const validation = subscriptionSchema.validate(req.body);

  if (validation.error) {
    return res.sendStatus(400);
  }

  try {
    const checkUserPlan = await connection.query(
      `
      SELECT * FROM users WHERE users.id = $1
    `,
      [userId]
    );
    if (checkUserPlan.rows[0].plan_type !== null) {
      return res.sendStatus(409);
    }

    const acronym = addressData.state;
    const getStateId = await connection.query(
      `
      SELECT * FROM states WHERE states.acronym = $1
    `,
      [acronym]
    );
    const stateId = getStateId.rows[0].id;

    await connection.query(
      `
    UPDATE users SET "plan_type" = $1 WHERE users.id = $2;`,
      [planId, userId]
    );

    await connection.query(
      `
      INSERT INTO
        addresses ("user_id", cep, address, city, "state_id", name)
      VALUES
        ($1, $2, $3, $4, $5, $6)
    `,
      [
        userId,
        addressData.cep,
        addressData.address,
        addressData.city,
        stateId,
        addressData.name,
      ]
    );
    if (planId === 1) {
      await connection.query(
        `
        INSERT INTO
          weekly_plan (user_id, delivery_day, tea, incense,  organics)
        VALUES
          ($1, $2, $3, $4, $5)
      `,
        [userId, deliveryDay, products.tea, products.incense, products.organics]
      );
    } else {
      await connection.query(
        `
        INSERT INTO
          monthly_plan (user_id, delivery_day, tea, incense,  organics)
        VALUES
          ($1, $2, $3, $4, $5)
      `,
        [userId, deliveryDay, products.tea, products.incense, products.organics]
      );
    }
    return res.sendStatus(201);
  } catch (err) {
    return res.sendStatus(500);
  }
};

export default Subscribe;
