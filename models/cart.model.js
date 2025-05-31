module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cart', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      total_quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};