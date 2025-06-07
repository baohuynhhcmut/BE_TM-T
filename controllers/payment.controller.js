const moment = require('moment');
const { Order, sequelize } = require("../models");
const { sendEmail } = require("../config/email")

async function sendPaymentEmail(orderId) {
    try {
        const results = await sequelize.query(`
            SELECT o.id AS order_id, o.total_price, o.date, u.fullname, u.email,
                p.id AS product_id, p.name AS product_name, p.price AS product_price, p.image,
                op.quantity, op.price AS item_price
            FROM Orders AS o
            JOIN OrderProduct AS op ON o.id = op.OrderId
            JOIN Users AS u ON u.id = o.UserId
            JOIN Products AS p ON p.id = op.ProductId
            WHERE o.id = :orderId
        `, {
            replacements: { orderId },
            type: sequelize.QueryTypes.SELECT
        });

        if (results.length === 0) {
            throw new Error("Order details not found for email");
        }

        const { order_id, total_price, fullname, email } = results[0];
        const productsHtml = results.map(row => `
            <tr>
                <td><img src="${row.image}" width="80"/></td>
                <td>${row.product_name}</td>
                <td>${Number(row.product_price).toLocaleString()}đ</td>
                <td>${row.quantity}</td>
                <td>${(row.item_price * row.quantity).toLocaleString()}đ</td>
            </tr>
        `).join("");

        const htmlContent = `
            <h2>✅ Đơn hàng của bạn đã được xác nhận thành công</h2>
            <p>Xin chào <strong>${fullname}</strong>,</p>
            <p>Đơn hàng <strong>#${order_id}</strong> đã được thanh toán thành công.</p>
            <table border="1" cellspacing="0" cellpadding="10" style="border-collapse: collapse;">
                <thead>
                    <tr>
                        <th>Ảnh</th>
                        <th>Tên</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHtml}
                </tbody>
            </table>
            <p style="text-align:right;font-weight:bold;">Tổng cộng: ${Number(total_price).toLocaleString()}đ</p>
            <p>Cảm ơn bạn đã mua hàng!</p>
        `;

        await sendEmail(email, `Xác nhận đơn hàng #${order_id}`, htmlContent);

        return { success: true };
    } catch (error) {
        console.error("Error sending payment email:", error);
        return { success: false, error };
    }
}

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

// const vnpay_return = async (req,res) => {
//     console.log('VNPAY return called');
//     let vnp_Params = req.query;
    
//     let orderId = vnp_Params['vnp_TxnRef'];
//     let rspCode = vnp_Params['vnp_ResponseCode'];
//     const id = parseInt(orderId)
//     // TODO
//     if(rspCode == "00"){
//         await Order.findOne({ where: { id: id } })
//             .then(order => {
//                 if (!order) {
//                     return res.status(404).json({ error: "Order not found" });
//                 }
//                 order.status = 'completed';
//                 await order.save()
//                     .then(() => {
//                         res.status(200).json({
//                             code: '00',
//                             message: 'Payment successful',
//                             data: order
//                         });
//                     })
//                     .catch(err => {
//                         console.error("Error updating order:", err);
//                         res.status(500).json({ error: "Internal Server Error" });
//                     });
//                 // Gửi email xác nhận thanh toán thành công
//                 try {
//                     const result = await sendPaymentEmail(id);
//                     if(result.success) {
//                         console.log("Payment email sent successfully");
//                     } else {
//                         console.error("Failed to send payment email:", result.error);
//                     }
//                     } catch (err) {
//                     console.error("Error sending payment email:", err);
//                     }
//             }).catch(err => {
//                 console.error("Error finding order:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             });
            
//         }
//     else{
//         Order.findOne({ where: { id: id } })
//             .then(order => {
//                 if (!order) {
//                     return res.status(404).json({ error: "Order not found" });
//                 }
//                 order.status = 'failed';
//                 await order.save()
//                     .then(() => {
//                         res.status(200).json({
//                             code: '00',
//                             message: 'Payment failed',
//                             data: order
//                         });
//                     })
//                     .catch(err => {
//                         console.error("Error updating order:", err);
//                         res.status(500).json({ error: "Internal Server Error" });
//                     });
//             })
//             .catch(err => {
//                 console.error("Error finding order:", err);
//                 res.status(500).json({ error: "Internal Server Error" });
//             });
//     }
// }

const vnpay_return = async (req, res) => {
    console.log('VNPAY return called');
    let vnp_Params = req.query;
    
    let orderId = vnp_Params['vnp_TxnRef'];
    let rspCode = vnp_Params['vnp_ResponseCode'];
    const id = parseInt(orderId);

    try {
        const order = await Order.findOne({ where: { id: id } });

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (rspCode === "00") {
            order.status = 'completed';
            await order.save();

            // Gửi email xác nhận thanh toán thành công
            try {
                const result = await sendPaymentEmail(id);
                if (result.success) {
                    console.log("Payment email sent successfully");
                } else {
                    console.error("Failed to send payment email:", result.error);
                }
            } catch (emailErr) {
                console.error("Error sending payment email:", emailErr);
            }

            return res.status(200).json({
                code: '00',
                message: 'Payment successful',
                data: order
            });
        } else {
            order.status = 'failed';
            await order.save();

            return res.status(200).json({
                code: '00',
                message: 'Payment failed',
                data: order
            });
        }
    } catch (err) {
        console.error("Error handling VNPAY return:", err);
        return res.status(500).json({ error: "Internal Server Error" });
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

