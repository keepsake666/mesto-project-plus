import process from 'process';
import express, { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardsRouter from './routes/card';
import { IRequestUser } from './types/requestUser';

const { PORT = 3003 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
app.use((req: IRequestUser, res: Response, next: NextFunction) => {
  req.user = {
    _id: '63eb6a678890ff9caab7f7fa', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardsRouter);
app.listen(PORT, () => {
  console.log('Ссылка на сервер:');
  console.log(PORT);
});
