import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@javachiphi-tix/common';
import cookieSession from 'cookie-session';

const app = express();
app.set('trust proxy', true); // let express know that ingress behind ngnix. trust traffic as being secure even though it is coming from a proxy
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
    // secure: process.env.NODE_ENV !== 'test',
  })
);
app.use(currentUser);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
