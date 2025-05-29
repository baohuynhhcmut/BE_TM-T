module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Voucher', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      code: { type: DataTypes.STRING, allowNull: false, unique: true },
      discount: { type: DataTypes.FLOAT, allowNull: false },
      type: { type: DataTypes.ENUM('fixed', 'percentage'), allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};