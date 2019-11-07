/* eslint-disable no-shadow */
/* eslint-disable no-console */
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

import User from '../../models/User';

class CreateUserController {
  async store(req, res) {
    try {
      const { name, email, password } = await req.body;

      const checkEmail = await User.findOne({ email });

      if (!checkEmail) {
        if (password.length >= 8) {
          const salt = bcrypt.genSaltSync(10);

          const passwordToSave = bcrypt.hashSync(password, salt);

          const token = Math.floor(Math.random() * 65536);

          const user = await User.create({
            name,
            email,
            password: passwordToSave,
            token,
          });

          const testAccount = await nodemailer.createTestAccount();

          const transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
              user: testAccount.user,
              pass: testAccount.pass,
            },
          });

          const info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: `<${email.trim().toLowerCase()}>`,
            subject: 'Verification token',
            text: `This is your token: ${token}`,
          });

          console.log('Message sent: %s', info.messageId);

          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          return res.json(user);
        }
        return res.send({ error: 'Password must be 8 or more digits ' });
      }

      return res.send({ error: 'E-mail already exists' });
    } catch (error) {
      return res.status(400).send({ error: 'Registration failed' });
    }
  }

  async check(req, res) {
    const { _id } = req.headers;

    const user = await User.findById({ _id });

    const tokenReceived = await req.body;

    if (user.token !== tokenReceived.token) {
      await User.findByIdAndDelete({ _id });

      return res
        .status(400)
        .send('The token does not match, please create a new account.');
    }

    await User.findByIdAndUpdate({ _id }, { verified: true });
    return res.send({ message: 'Ok. Account created' }).status(200);
  }
}

export default new CreateUserController();
