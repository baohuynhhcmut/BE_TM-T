const moment = require('moment');
const { Order  } = require("../models");

const create_url = (req,res) => {
    try {
        const vnp_TmnCode = process.env.vnp_TmnCode
        const vnp_HashSecret = process.env.vnp_HashSecret
        let vnp_Url = process.env.vnp_Url
        const vnp_ReturnUrl = process.env.vnp_Return
        const ipAddr =  req.headers['x-forwarded-for'] ||
                        req.connection.remoteAddress ||
                        req.socket.remoteAddress ||
                        req.connection.socket.remoteAddress;


        const amount = req.body.amount;
        const orderId = req.body.orderId;
        const bankCode = req.body.bankCode;

        if (!vnp_TmnCode || !vnp_HashSecret || !vnp_Url) {
            return res.status(500).json({ error: "VNPAY configuration is missing" });
        }

        const locale = 'vn'
        const currCode = 'VND';

        let vnp_Params = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: vnp_TmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: currCode,
            vnp_TxnRef: orderId,
            vnp_OrderInfo: `Thanh toán đơn hàng ${orderId}`,
            vnp_OrderType: 'other',
            vnp_Amount: amount * 100,
            vnp_BankCode: bankCode,
            vnp_ReturnUrl: vnp_ReturnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: moment(new Date()).format('YYYYMMDDHHmmss'),
        };


        vnp_Params = sortObject(vnp_Params);
        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");     
        let hmac = crypto.createHmac("sha512", vnp_HashSecret);
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        vnp_Url += '?' + querystring.stringify(vnp_Params, { encode: false });

        res.status(200).json({
            code: '0',
            message: 'success',
            data: vnp_Url
        });

    } catch (error) {
        console.error("Error creating URL:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const vnpay_return = async (req,res) => {
    console.log('VNPAY return called');
    let vnp_Params = req.query;
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];
    const id = parseInt(orderId)
    // Mail thành công hay thất bại ở đây nè Nhân !!
    // TODO
    if(rspCode == "00"){
        Order.findOne({ where: { id: id } })
            .then(order => {
                if (!order) {
                    return res.status(404).json({ error: "Order not found" });
                }
                order.status = 'completed';
                order.save()
                    .then(() => {
                        res.status(200).json({
                            code: '00',
                            message: 'Payment successful',
                            data: order
                        });
                    })
                    .catch(err => {
                        console.error("Error updating order:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
            })
            .catch(err => {
                console.error("Error finding order:", err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    }
    else{
        Order.findOne({ where: { id: id } })
            .then(order => {
                if (!order) {
                    return res.status(404).json({ error: "Order not found" });
                }
                order.status = 'failed';
                order.save()
                    .then(() => {
                        res.status(200).json({
                            code: '00',
                            message: 'Payment failed',
                            data: order
                        });
                    })
                    .catch(err => {
                        console.error("Error updating order:", err);
                        res.status(500).json({ error: "Internal Server Error" });
                    });
            })
            .catch(err => {
                console.error("Error finding order:", err);
                res.status(500).json({ error: "Internal Server Error" });
            });
    }
}



module.exports = {
    create_url,
    vnpay_return
}

function sortObject(obj) {
	let sorted = {};
	let str = [];
	let key;
	for (key in obj){
		if (obj.hasOwnProperty(key)) {
		str.push(encodeURIComponent(key));
		}
	}
	str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}