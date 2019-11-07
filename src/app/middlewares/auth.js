import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { secret } from '../../config/auth.json';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).send({ error: 'No token provided' });
  }

  const parts = authorization.split(' ');

  if (!parts.length === 2) {
    return res.status(401).send({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, secret);
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(400).json({ error: 'Token invalid' });
  }
};
