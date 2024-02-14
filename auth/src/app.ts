import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler, NotFoundError } from '@javachiphi-tix/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); // let express know that ingress behind ngnix. trust traffic as being secure even though it is coming from a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false,
    // secure: false,
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

export { app };
