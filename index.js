import express from "express";
import { initDb } from "./db/connectdb.js";
import { globalErrorHandler } from "./utils/index.js";
import AuthRoute from "./src/authentication/routes.js";
import UsersRoute from "./src/users/routes.js";
import ProductRoute from "./src/products/routes.js";
import CartRoute from "./src/cart/routes.js";
import session from "express-session";
import { redisStore } from "./utils/index.js";
import {
  validateAuthBody,
  authMiddleWare,
  validateProductBody,
} from "./middlewares/index.js";
import cookieParser from "cookie-parser";
import rateLimiter from "./middlewares/rateLimiter.js";
import { emailTokenVerification } from "./utils/emailVerification.js";
import OTPRouter from './src/resetPassword/routes.js'

const app = express();
app.use(express.json());
app.use(cookieParser());

// intialize session storage
app.use(
  session({
    store: redisStore,
    secret: process.env.REDIS_SECRET,
    resave: false, // does not save unmodified session
    saveUninitialized: true, // does not save empty sessions
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 3,
    },
  })
);

app.use('/', OTPRouter);
app.use("/auth", rateLimiter(), validateAuthBody, AuthRoute);
app.use("/verify/:token", emailTokenVerification);

app.use("/users", authMiddleWare, UsersRoute);
app.use("/products", authMiddleWare, validateProductBody, ProductRoute);
app.use("/cart", authMiddleWare, CartRoute);

app.use(globalErrorHandler);

app.all("*", (req, res) => {
  res.status(404).send("PAGE NOT FOUND OR WRONG METHOD USED!!!");
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await initDb();
    app.listen(PORT, async () => {
      console.log(`App listening on ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

start();
