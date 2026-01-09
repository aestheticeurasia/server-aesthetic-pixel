import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        
        status: {
            type: String,
            enum: ["Pending", "Approved", "Delivered", "Cancelled"],
            default: "Pending",
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);