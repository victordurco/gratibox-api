import './setup.js';
import express from 'express';
import cors from 'cors';
import SignUp from './controllers/SignUp.js';
import SignIn from './controllers/SignIn.js';
import getUser from './controllers/getUser.js';
import getStates from './controllers/getStates.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

app.post('/sign-up', SignUp);

app.post('/sign-in', SignIn);

app.get('/user', getUser);

app.get('/states', getStates);

export default app;
