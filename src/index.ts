import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  if (!process.env.jwt) {
    throw new Error('JWT_KEY must be defined');
  }

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
