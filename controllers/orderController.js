import orderModel from "../model/orderModel.js";

export const createOrderController = async (req, res) => {
    try {
        const {
            orderItems,
            subTotal,
            discountedAmount,
            finalPrice,
            paymentDetails,
        } = req.body;

        // validation
        if (!Array.isArray(orderItems) || orderItems.length === 0) {
            return res.status(400).send({
                success: false,
                message: "No order items provided",
            });
        }

        if (
            subTotal === undefined ||
            finalPrice === undefined ||
            discountedAmount === undefined
        ) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields",
            });
        }

        if (!Array.isArray(paymentDetails) || paymentDetails.length === 0) {
            return res.status(400).send({
                success: false,
                message: "Please provide at least one payment detail",
            });
        }

        const createdBy = req.user._id;

        const order = new orderModel({
            orderItems,
            subTotal,
            discountedAmount,
            finalPrice,
            paymentDetails,
            createdBy,
        });

        await order.save();

        res.status(201).send({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error placing order",
            error: error.message,
        });
    }
};


//get orders details by user
export const getOrdersByUserController = async (req, res) => {
    try {
        const orders = await orderModel.find({ createdBy: req.user._id }).populate('orderItems.productId').sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "User orders fetched successfully",
            orders,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error getting orders",
            error: error.message,
        });
    }
};