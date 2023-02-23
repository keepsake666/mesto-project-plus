import {
  Model, model, Schema, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { valid } from '../constants/app';

export interface User {
  name: string
  about: string
  avatar: string
  email: string
  password: string
}
interface UserModel extends Model<User> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, User>>
}
const userSchema = new Schema<User, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v:string) => valid.test(v),
      message: 'Неверная ссылка на аватар',
    },
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v:string) => validator.isEmail(v),
      message: 'Неверна введена почта',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }
          return user;
        });
    });
});

export default model<User, UserModel>('user', userSchema);
