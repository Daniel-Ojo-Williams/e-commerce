// create user database
// user authentication
// 

import express from 'express';
import pool, { initDb } from './db/connectdb.js';
import {globalErrorHandler} from './utils/index.js';
import AuthRoute from './authentication/routes.js';

const app = express();
app.use(express.json());


app.use('/users', AuthRoute);

app.use(globalErrorHandler)

const PORT = process.env.PORT || 3000;

const start = async() => {
  await initDb()
  app.listen(PORT, async () => {
    console.log(`App listening on ${PORT}`)
  })
}

start();