import faker from 'faker';
import connection from '../src/database';
import { existingUserFactory, existingUserWithPlanFactory } from './user.factory';

const validSubscribeBodyFactory = async () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeAddress = faker.address.country('Brazil');
  const fakeCep = '00000-000';
  const mokedCity = 'Campinas';
  const mokedState = 'SP';
  const mokedProducts = {
    tea: true,
    incense: true,
    organics: true,
  };
  const user = await existingUserFactory();
  const getUserId = await connection.query(`
    SELECT * FROM users WHERE users.email = $1
  `, [user.email]);
  const userId = getUserId.rows[0].id;
  const mokedPlanId = 1;
  const mokedDeliveryDay = 'monday';

  return ({
    addressData: {
      address: fakeAddress,
      cep: fakeCep,
      city: mokedCity,
      name: fakeName,
      state: mokedState,
    },
    deliveryDay: mokedDeliveryDay,
    planId: mokedPlanId,
    userId,
    products: mokedProducts,
  });
};

const invalidSubscribeBodyFactory = async () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeAddress = faker.address.country('Brazil');
  const fakeCep = '00000-000';
  const mokedCity = 'Campinas';
  const mokedState = 'SP';
  const mokedPlanId = 3;
  const mokedDeliveryDay = 'monday';

  return ({
    addressData: {
      address: fakeAddress,
      cep: fakeCep,
      city: mokedCity,
      name: fakeName,
      state: mokedState,
    },
    deliveryDay: mokedDeliveryDay,
    planId: mokedPlanId,
  });
};

const userWithPlanSubscribeBodyFactory = async () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeAddress = faker.address.country('Brazil');
  const fakeCep = '00000-000';
  const mokedCity = 'Campinas';
  const mokedState = 'SP';
  const mokedProducts = {
    tea: true,
    incense: true,
    organics: true,
  };
  const user = await existingUserWithPlanFactory();
  const getUserId = await connection.query(`
    SELECT * FROM users WHERE users.email = $1
  `, [user.email]);
  const userId = getUserId.rows[0].id;
  const mokedPlanId = 1;
  const mokedDeliveryDay = 'monday';

  return ({
    addressData: {
      address: fakeAddress,
      cep: fakeCep,
      city: mokedCity,
      name: fakeName,
      state: mokedState,
    },
    deliveryDay: mokedDeliveryDay,
    planId: mokedPlanId,
    userId,
    products: mokedProducts,
  });
};

export { validSubscribeBodyFactory, invalidSubscribeBodyFactory, userWithPlanSubscribeBodyFactory };
