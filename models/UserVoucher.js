module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "UserVoucher",
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
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
      usedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: "Thời gian sử dụng voucher",
      },
      isUsed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "Đã sử dụng voucher chưa",
      },
    },
    {
      tableName: "UserVoucher",
      timestamps: true,
    }
  );
};
