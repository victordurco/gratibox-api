import './setup.js';
import express from 'express';
import cors from 'cors';
import SignUp from './controllers/SignUp.js';
import SignIn from './controllers/SignIn.js';

const app = express();
app.use(express.json());
app.use(cors());

app.get('/status', (req, res) => {
  res.sendStatus(200);
});

app.post('/sign-up', SignUp);

app.post('/sign-in', SignIn);

export default app;
