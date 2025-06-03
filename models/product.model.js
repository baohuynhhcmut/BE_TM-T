module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Product', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      price: { type: DataTypes.FLOAT, allowNull: false },
      description: DataTypes.TEXT,
      total: { type: DataTypes.INTEGER, allowNull: false },
      image: DataTypes.STRING,
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false },
      cost: { type: DataTypes.FLOAT, allowNull: false }
  });
};