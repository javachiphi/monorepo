import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); // let express know that ingress behind ngnix. trust traffic as being secure even though it is coming from a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
    // secure: process.env.NODE_ENV !== 'test',
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    // need to connect to cluster IP address since our db lives in a pod
    // mongo will automatically create db for us under the name auth
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('connected to mongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000?!');
  });
};

start();
