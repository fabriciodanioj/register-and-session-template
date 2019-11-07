import 'dotenv/config';

import * as Youch from 'youch';
import express from 'express';
import 'express-async-errors';
import { connect, set } from 'mongoose';

import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.database();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(express.json());
  }

  database() {
    connect(
      'mongodb+srv://admin:admin@fabricio-krmro.mongodb.net/estoqueTestes?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    );
    set('useCreateIndex', true);
  }

  routes() {
    this.server.use(routes);
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ error: 'Internal server error' });
    });
  }
}

export default new App().server;
