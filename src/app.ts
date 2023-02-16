import process from 'process';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';

const { PORT = 3003 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use('/users', userRouter);
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
