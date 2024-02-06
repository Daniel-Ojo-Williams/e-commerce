import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import Users from "../models/users.js";
import { CustomError, asyncWrapper } from "./index.js";

// email sender authentication
let transporter = nodemailer.createTransport({
  service: "gmail",
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// email verification function
const sendMail = async ({user={}, email='', content='', subject='', title=''}) => {
  
  // generate verification token with user_id
  let token = jwt.sign({ userId: user.user_id }, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });

  let link = `http://localhost:3000/verify/${token}`;
  let defaultContent = `<p>Welcome to E-commerce App ${user.first_name} ${user.last_name}</p><br/><p>Here is your verification link, click <a href=${link} >here<a/> to verify. The link expires in 10 minutes.</p>`;
  let defaultSubject = "E-commerce App: Welcome to E-commerce App";
  let fromTitle = title || 'Email verification';

  let message = {
    from: `${fromTitle} <freakydmuse@gmail.com>`,
    to: email || user.email,
    subject: subject || defaultSubject,
    html: content || defaultContent,
  };

  try {
    const response = await transporter.sendMail(message);
    
  } catch (error) {
    console.log(error.message)
    throw new CustomError('Sorry an error occurred, please try again')
  }
};

// verify token from email
export const emailTokenVerification = asyncWrapper(async (req, res) => {
  const { token } = req.params;
  
  if(!token){
    throw new CustomError('Sorry an error occurred, could not parse token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  let userId = decoded.userId;
  await Users.verifyEmail(userId);
  
  res.send('Account verified successfully');
});

export default sendMail;