'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transaction.belongsTo(models.user, {
        foreignKey: {
          name: "partnerId",
        },
      });
      transaction.belongsTo(models.user, {
        foreignKey: {
          name: "userId",
        },
      });
      transaction.hasMany(models.order);
    }
  };
  transaction.init({
    userId: DataTypes.INTEGER,
    partnerId: DataTypes.INTEGER,
    date: DataTypes.DATE,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaction',
  });
  return transaction;
};