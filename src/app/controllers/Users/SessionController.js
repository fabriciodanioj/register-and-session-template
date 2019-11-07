import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { secret } from '../../../config/auth.json';

import User from '../../models/User';

class SessionController {
  async index(req, res) {
    const { email, password } = await req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.send({ error: 'User not found' });
    }

    if (!user.verified) {
      return res.send({ error: 'Please confirm your account' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.send({ error: 'Password is wrong' });
    }

    user.password = undefined;
    user.token = undefined;

    const token = jwt.sign({ id: user.id }, secret, {
      expiresIn: 86400,
    });

    return res.json({ user, token });
  }
}

export default new SessionController();
