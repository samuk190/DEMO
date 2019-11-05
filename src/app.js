import express from 'express';
import path from 'path';
import routes from './routes';
import './database'; // nao precisa pegar index pega automaticamente

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
    // para o navegador acessar de forma estatica publico
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'temp', 'uploads'))
    );
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server; // duas formas
// module.exports = new App().server;
