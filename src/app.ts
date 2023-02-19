import process from 'process';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardsRouter from './routes/card';
import auth from './middlewares/auth';
import { login, postUser } from './controllers/users';

const { PORT = 3003 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', login);
app.post('/signup', postUser);
app.use(auth);
app.use('/users', userRouter);
app.use('/cards', cardsRouter);

app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
