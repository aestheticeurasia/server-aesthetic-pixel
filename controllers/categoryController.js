import categoryModel from '../model/categoryModel.js';
import subCategoryModel from '../model/subCategoryModel.js';
import dotenv from 'dotenv';
import slugify from 'slugify';

//declare dotenv
dotenv.config();

//create category controller
export const createCategoryController = async (req, res) => {
    try {
        const { name, description } = req.fields;

        // Validation
        if (!name) return res.status(400).send({
            success: false, message: "Name is required"
        });
        if (!description) return res.status(400).send({
            success: false, message: "Description is required"
        });

        // Check if cateogy already exists
        const existingCategory = await categoryModel.findOne({ name: name });
        const existingSubCategory = await subCategoryModel.findOne({ name: name });

        if (existingCategory) {
            if (existingCategory.name === name) {
                return res.status(409).send({
                    success: false, message: "Category already exists"
                });
            }
        };

        if (existingSubCategory) {
            if (existingSubCategory.name === name) {
                return res.status(409).send({
                    success: false, message: "SubCategory already exists"
                });
            }
        };

        // Set createdBy from logged-in user
        const createdBy = req.user?._id;

        // Create user
        const category = await new categoryModel({ name, slug: slugify(name), description, createdBy }).save();

        res.status(201).send({
            success: true,
            message: "Category created successfully!",
            category,
        });


    } catch (error) {
        res.send({
            success: false,
            message: 'Category Creation Error',
            error: error.message
        })
    }
};

//update category controller
export const updateCategoryController = async (req, res) => { };

//get all categories controller
export const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find({});
        res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            categories
        });
    } catch (error) {
        res.send({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        })
    }
};

//delete single category controller
export const deleteCategoryController = async (req, res) => { };