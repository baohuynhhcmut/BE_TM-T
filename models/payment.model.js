module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Payment', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      method: { type: DataTypes.STRING, allowNull: false },
      amount: { type: DataTypes.FLOAT, allowNull: false },
      date: { type: DataTypes.DATE, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};