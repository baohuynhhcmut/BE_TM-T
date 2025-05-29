module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Shipping', {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        tracking_number: { type: DataTypes.STRING, allowNull: false, unique: true },
        status: { type: DataTypes.STRING, allowNull: false },
        estimated_delivery: DataTypes.DATE,
        address: { type: DataTypes.STRING, allowNull: false },       
        ship_date: { type: DataTypes.DATE, allowNull: false },       
        createdAt: { type: DataTypes.DATE, allowNull: false },
        updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
};