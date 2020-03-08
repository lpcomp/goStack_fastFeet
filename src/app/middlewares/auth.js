import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Você não possui um Token!' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decode = await promisify(jwt.verify)(token, authConfig.secret); // promisify usado para criar uma token e não utilizar o modo callback

    req.userId = decode.id;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido! ' });
  }
};
