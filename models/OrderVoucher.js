module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "OrderVoucher",
    {
      OrderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Orders",
          key: "id",
        },
      },
      VoucherId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Vouchers",
          key: "id",
        },
      },
    },
    {
      tableName: "OrderVoucher",
      timestamps: false,
    }
  );
};
