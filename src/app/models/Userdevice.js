import Sequelize, { Model } from 'sequelize';
// import { isBefore, subHours } from 'date-fns';

class Userdevice extends Model {
  static init(sequelize) {
    super.init(
      {
        // so colunas inseridas no usuario
        iddevice: Sequelize.STRING,
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
    this.belongsTo(models.User, { foreignKey: 'userid', as: 'user' });
  }
}
export default Userdevice;
