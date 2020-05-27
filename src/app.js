import 'dotenv/config';
import express from 'express';

import path from 'path';
import cors from 'cors';
import * as Sentry from '@sentry/node';
// EXPRESS ASYNC ERRORS E YOUCH PRECISA VIR ANTES DAS ROTAS
import Youch from 'youch';
import 'express-async-errors';

import routes from './routes';
import './database'; // nao precisa pegar index pega automaticamente
import sentryConfig from './config/sentry';

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);

    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    // antes de todos os middlewares
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(cors());
    this.server.use(express.json());
    // para o navegador acessar de forma estatica publico
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
    // error depois de todos os controllers
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();
        return res.status(500).json(errors);
      }
      return res.status(500).json({ error: 'Internal Server Error' });
    });
  }
}

export default new App().server; // duas formas
// module.exports = new App().server;
