module.exports = (sequelize, DataTypes) => {
  return sequelize.define("CartProduct", {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    // createdAt: { type: DataTypes.DATE, allowNull: false },
    // updatedAt: { type: DataTypes.DATE, allowNull: false },
  },{
    tableName: 'CartProduct' 
  });
};
