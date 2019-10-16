import models from '../models';

export const createUsers = async date => {
  await models.User.create({
    username: 'jmgr2996',
    email: 'jmgr2996@gmail.com',
    password: 'xVgJkMN7)!@H',
    role: 'ADMIN',
    gender: 'M',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });
  await models.User.create({
    username: 'andres9722',
    email: 'andres9722@gmail.com',
    password: 'xVAAkMN7)!@H',
    role: 'USER',
    gender: 'M',
    createdAt: date.setSeconds(date.getSeconds() + 1),
  });
};

export const getMe = async req => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        'Your session expired. Sign in again',
      );
    }
  }
};

export const eraseDatabaseOnSync = false;
