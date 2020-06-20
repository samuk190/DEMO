module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'phonenumber', Sequelize.STRING),
      queryInterface.addColumn('users', 'street', Sequelize.STRING),
      queryInterface.addColumn('users', 'streetnumber', Sequelize.INTEGER),

      /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'phonenumber', Sequelize.STRING),
      queryInterface.removeColumn('users', 'street', Sequelize.STRING),
      queryInterface.removeColumn('users', 'streetnumber', Sequelize.INTEGER),

      /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    ]);
  },
};
