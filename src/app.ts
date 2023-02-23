import process from 'process';
import express from 'express';
import mongoose from 'mongoose';
import { celebrate, errors, Joi } from 'celebrate';
import userRouter from './routes/user';
import cardsRouter from './routes/card';
import auth from './middlewares/auth';
import { creatUser, login } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import error from './middlewares/errors';
import { valid } from './constants/app';

const { PORT = 3003, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(valid),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(3),
  }),
}), creatUser);

app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.use(errorLogger);
app.use(errors());
app.use(error);

const connect = async () => {
  try {
    await mongoose.connect(MONGO_URL);
    app.listen(
      PORT,
      // eslint-disable-next-line no-console
      () => console.log(`Ссылка на сервер: ${PORT}`),
    );
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
};
connect();
