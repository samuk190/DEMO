import Sequelize, { Model } from 'sequelize';

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        // so colunas inseridas no usuario
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        // campo virtual para front acessar url
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
        // outras opcoes
      }
    );

    return this;
    // trechos de codigos que sao executados de forma automatica
    // funciona de forma automatica baseado em ações no model
  }
}
export default File;
