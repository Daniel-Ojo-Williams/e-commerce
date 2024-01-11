import express from 'express';
import pool, { initDb } from './db/connectdb.js';
import {asyncWrapper, globalErrorHandler} from './utils/index.js';
import AuthRoute from './src/authentication/routes.js';
import UsersRoute from './src/users/routes.js';
import ProductRoute from './src/products/routes.js';
import CartRoute from './src/cart/routes.js';
import session from 'express-session';
import { redisStore } from './utils/index.js';
import { validateAuthBody, authMiddleWare, validateProductBody } from './middlewares/index.js';
import cookieParser from 'cookie-parser';
import rateLimiter from "./middlewares/rateLimiter.js";


const app = express();
app.use(express.json());
app.use(cookieParser());


// intialize session storage
app.use(session({
  store: redisStore,
  secret: process.env.REDIS_SECRET,
  resave: false, // does not save unmodified session
  saveUninitialized: true, // does not save empty sessions
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 3
  }
}));


app.use('/auth', rateLimiter(), validateAuthBody, AuthRoute);
app.use(authMiddleWare);
app.use('/users', UsersRoute);
app.use('/products', validateProductBody, ProductRoute);
app.use('/cart', CartRoute);

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