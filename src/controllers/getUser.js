/* eslint-disable comma-spacing */
/* eslint-disable comma-dangle */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
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

const getSubscription = async (req, res) => {
  const { authorization } = req.headers;
  const token = authorization?.split('Bearer ')[1];

  const jwtSecret = process.env.JWT_SECRET;
  const user = jwt.verify(token, jwtSecret);

  try {
    const userQuery = await connection.query('SELECT users.name, users.plan_type AS "planType" FROM users WHERE id = $1', [user.id]);
    const userData = userQuery.rows[0];

    const subscriptionQuery = userData.planType === 1
      ? `SELECT 
          weekly_plan.created_at AS "subscriptionDate", weekly_plan.tea, weekly_plan.incense, weekly_plan.organics, weekly_plan.delivery_day AS "deliveryDay"
        FROM weekly_plan
        WHERE user_id = $1`
      : `SELECT 
          monthly_plan.created_at AS "subscriptionDate", monthly_plan.tea, monthly_plan.incense, monthly_plan.organics, monthly_plan.delivery_day AS "deliveryDay"
         FROM monthly_plan
        WHERE user_id = $1`;

    const result = await connection.query(subscriptionQuery, [user.id]);

    const defaultSubscription = {
      deliveryDay: '',
      tea: '',
      incense: '',
      organics: '',
    };

    const subscription = result.rows[0] || defaultSubscription;
    let { subscriptionDate } = subscription;
    const { deliveryDay } = subscription;
    const nextDeliveries = [];

    if (userData.planType === 1) {
      const days = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      };
      const weekday = dayjs(subscriptionDate).format('dddd').toLocaleLowerCase();
      let daysToFirstDelivery = days[deliveryDay] - days[weekday];
      if (daysToFirstDelivery === 0) {
        daysToFirstDelivery = 7;
      }
      let nextDate = dayjs(subscriptionDate).add(daysToFirstDelivery, 'day');
      nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      for (let i = 0; i < 2; i += 1) {
        nextDate = dayjs(nextDate).add(7, 'day');
        nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      }
    } else if (userData.planType === 2) {
      const skipWeekend = (date) => {
        const dateWeekday = dayjs(date).format('dddd').toLocaleLowerCase();
        let finalDate = date;
        if (dateWeekday === 'saturday') {
          finalDate = dayjs(finalDate).add(2, 'day');
        } else if (dateWeekday === 'sunday') {
          finalDate = dayjs(finalDate).add(1, 'day');
        }
        return finalDate;
      };

      let nextDate = dayjs(subscriptionDate).date(Number(deliveryDay));
      const isAfter = dayjs(nextDate).isAfter(dayjs(subscriptionDate));
      if (!isAfter) {
        nextDate = dayjs(nextDate).add(1, 'month');
      }
      nextDate = skipWeekend(nextDate);
      nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      for (let i = 0; i < 2; i += 1) {
        nextDate = dayjs(nextDate).date(Number(deliveryDay));
        nextDate = dayjs(nextDate).add(1, 'month');
        nextDate = skipWeekend(nextDate);
        nextDeliveries.push(nextDate.format('DD/MM/YYYY'));
      }
    }

    subscriptionDate = dayjs(subscriptionDate).format('DD/MM/YY');

    res.status(200).send({
      ...userData,
      subscription: {
        ...subscription,
        subscriptionDate,
        nextDeliveries,
      },
    });
  } catch (err) {
    res.sendStatus(500);
  }
};

export { getUser, getSubscription };
