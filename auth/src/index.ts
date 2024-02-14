import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('starting up....');
  if (!process.env.jwt) {
    throw new Error('JWT_KEY must be defined');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    // need to connect to cluster IP address since our db lives in a pod
    // mongo will automatically create db for us under the name auth
    await mongoose.connect(process.env.MONGO_URI);
    console.log('connected to mongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000?!');
  });
};

start();
