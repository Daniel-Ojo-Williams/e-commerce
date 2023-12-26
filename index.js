// create user database
// user authentication
// 

import express from 'express';
import pool, { initDb } from './db/connectdb.js';
import {asyncWrapper, globalErrorHandler} from './utils/index.js';
import AuthRoute from './authentication/routes.js';
import ProductRoute from './products/routes.js';

const app = express();
app.use(express.json());


app.use('/users', AuthRoute);
app.use('/products', ProductRoute)

app.use(globalErrorHandler)

app.all('*', (req, res) => {
  res.status(404).send('PAGE NOT FOUND OR WRONG METHOD USED!!!')
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await initDb();
    app.listen(PORT, async () => {
      console.log(`App listening on ${PORT}`);
    });
    
  } catch (error) {
    console.log(error.message)
  }
};

start();