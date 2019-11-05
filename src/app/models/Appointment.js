import Sequelize, { Model } from 'sequelize';

class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        // so colunas inseridas no usuario
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // campo virtual para front acessar url
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

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}
export default Appointment;
