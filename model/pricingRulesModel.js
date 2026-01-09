const pricingRulesSchema = new mongoose.Schema(
    {
        defaultPhotoCount: {
            type: Number,
            default: 4,
        },
        extraPhotoPrice: {
            type: Number,
            default: 100,
        },
        discountRules: [
            {
                minQuantity: {
                    type: Number,
                    required: true,
                },
                maxQuantity: {
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
        isActive: {
            type: Boolean,
            default: true,
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