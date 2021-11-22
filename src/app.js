import './setup.js';
import express from 'express';
import cors from 'cors';
import signUp from './controllers/signUp.js';
import signIn from './controllers/signIn.js';
import getUser from './controllers/getUser.js';
import getStates from './controllers/getStates.js';
import auth from './middlewares/auth.js';
import subscribe from './controllers/subscribe.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

app.post('/sign-up', signUp);

app.post('/sign-in', signIn);

app.get('/user', getUser);

app.get('/states', getStates);

app.post('/subscribe', auth, subscribe);

export default app;
