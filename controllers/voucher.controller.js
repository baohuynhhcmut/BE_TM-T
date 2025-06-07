const {Voucher, sequelize} = require('../models');

const getVoucher = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ message: "Voucher code is required", error_code: 400 });
        }
        const voucher = await Voucher.findOne({
            where: {
                code: code,
                status: 'active'
            }
        });
        if (!voucher) {
            return res.status(404).json({ message: "Voucher not found", error_code: 404 });
        }
        return res.status(200).json({
            message: "Voucher retrieved successfully",
            data: voucher
        });
    } catch (error) {
        console.error("Error retrieving vouchers:", error);
        res.status(500).json({ message: "Internal server error", error_code: 500 });
    }
}

module.exports = {
    getVoucher,
};