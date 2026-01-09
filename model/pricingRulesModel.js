import mongoose from "mongoose";

const pricingRulesSchema = new mongoose.Schema(
    {
        defaultPhotoCount: {
            type: Number,
            required: true,
        },
        extraPhotoPrice: {
            type: Number,
            required: true,
        },
        discountRules: [
            {
                minQty: {
                    type: Number,
                    required: true,
                },
                maxQty: {
                    type: Number,
                    required: true,
                },
                discountPercentage: {
                    type: Number,
                    required: true,
                    min: 0,
                    max: 100,
                },
            },
        ],
        maxQtyPerOrder: {
            type: Number,
            default: 100,
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
export default mongoose.model("PricingRules", pricingRulesSchema);