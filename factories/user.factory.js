/* eslint-disable comma-dangle */
import faker from 'faker';
import bcrypt from 'bcrypt';
import connection from '../src/database';

const validNewUserFactory = () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeEmail = faker.internet.email();
  const fakePassword = faker.internet.password();

  return {
    name: fakeName,
    email: fakeEmail,
    password: fakePassword,
  };
};

const invalidNewUserFactory = () => {
  const fakeName = `${faker.name.firstName()} ${faker.name.middleName()} ${faker.name.lastName()}`;
  const fakeEmail = faker.internet.email();

  return {
    name: fakeName,
    email: fakeEmail,
    password: '12345',
  };
};

const existingUserFactory = async () => {
  const newUser = validNewUserFactory();
  const encryptedPassword = bcrypt.hashSync(newUser.password, 10);
  await connection.query(
    `
    INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`,
    [newUser.name, newUser.email, encryptedPassword]
  );

  return {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
  };
};

const existingUserWithPlanFactory = async () => {
  const newUser = validNewUserFactory();
  const encryptedPassword = bcrypt.hashSync(newUser.password, 10);
  await connection.query(
    `
    INSERT INTO users (name, email, password, plan_type) VALUES ($1, $2, $3, $4);`,
    [newUser.name, newUser.email, encryptedPassword, 1]
  );

  return {
    name: newUser.name,
    email: newUser.email,
    password: newUser.password,
  };
};

const validUserFactory = async () => {
  const user = await existingUserFactory();
  return {
    email: user.email,
    password: user.password,
  };
};

const wrongPasswordUserFactory = async () => {
  const validUser = await validUserFactory();

  return {
    email: validUser.email,
    password: 'wrongpassword',
  };
};

const invalidUserFactory = () => ({
  email: faker.internet.email(),
});

const nonExistentUserFactory = () => ({
  email: 'nonexistentemail@nonexistent.com',
  password: faker.internet.password(),
});

export {
  validNewUserFactory,
  invalidNewUserFactory,
  existingUserFactory,
  existingUserWithPlanFactory,
  validUserFactory,
  wrongPasswordUserFactory,
  invalidUserFactory,
  nonExistentUserFactory,
};
