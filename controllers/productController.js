import slugify from "slugify";
import productModel from "../model/productModel.js";

export const createProductController = async (req, res) => {
    try {
        const { name, basePrice, photoURL, active } = req.fields;

        //validation
        if (!name) {
            return res.status(400).send({ message: "Name is required" });
        }
        if (!basePrice) {
            return res.status(400).send({ message: "Base Price is required" });
        }

        //check for existing product
        const existingProduct = await productModel.findOne({ name });
        if (existingProduct) {
            return res.status(200).send({
                success: false,
                message: "Product already exists",
            });
        }

        const createdBy = req.user._id;

        //create product
        const product = await productModel.create({
            name,
            slug: slugify(name),
            basePrice,
            photoURL,
            active,
            createdBy,
        });

        res.status(201).send({
            success: true,
            message: "Product created successfully",
            product,
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in creating product",
            error: error.message,
        });
    }
};


export const updateProductController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, basePrice, photoURL, active } = req.fields;
        const updatedBy = req.user._id;

        //validation
        if (!name) {
            return res.status(400).send({ message: "Name is required" });
        }
        if (!basePrice) {
            return res.status(400).send({ message: "Base Price is required" });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                slug,
                basePrice,
                photoURL,
                active,
                updatedBy,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            updatedProduct,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in updating product",
            error: error.message,
        });
    }
};

//get all product
export const getAllProductsController = async (req, res) => {
    try {
        const products = await productModel.find({});
        res.status(200).send({
            success: true,
            message: "All products fetched successfully",
            products,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in getting products",
            error: error.message,
        });
    }
};

//delete product
export const deleteProductController = async (req, res) => {
    try {
        const { id } = req.params;
        await productModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error in deleting product",
            error: error.message,
        });
    }
};