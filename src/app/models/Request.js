import Sequelize, { Model } from 'sequelize';
// import { isBefore, subHours } from 'date-fns';

class Request extends Model {
  static init(sequelize) {
    super.init(
      {
        // so colunas inseridas no usuario
        lat: Sequelize.FLOAT,
        lon: Sequelize.FLOAT,
        type: Sequelize.INTEGER,
        read: Sequelize.BOOLEAN,
      },
      // campo virtual para front acessar url

      {
        sequelize,
        // outras opcoes
      }
    );

    return this;
    // trechos de codigos que sao executados de forma automatica
    // funciona de forma automatica baseado em ações no model
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}
export default Request;
