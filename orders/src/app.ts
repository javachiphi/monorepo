import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import {
  errorHandler,
  NotFoundError,
  currentUser,
} from '@javachiphi-tix/common';
import cookieSession from 'cookie-session';
import { newOrderRouter } from './routes/new';
import { showOrderRouter } from './routes/show';
import { indexOrderRouter } from './routes/index';
import { deleteOrderRouter } from './routes/delete';

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
app.use(currentUser);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
