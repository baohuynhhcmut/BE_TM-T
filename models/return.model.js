module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Return', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        reason: { type: DataTypes.STRING, allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false },
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
};