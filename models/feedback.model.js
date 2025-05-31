module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Feedback', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      comment: DataTypes.TEXT,
      rate_star: { type: DataTypes.INTEGER, allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
  });
};