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
        res.status(500).send({
            success: false,
            message: 'Category Creation Error',
            error: error.message
        })
    }
};

//update category controller
export const updateCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.fields;

        //check name in Category
        const exisitingCategory = await categoryModel.findOne({ name: name });
        if (exisitingCategory && exisitingCategory._id.toString() !== id) {
            return res.status(409).send({
                success: false,
                message: "Category already exist"
            });
        }

        // Check name in SubCategory
        const exisitingSubCategory = await subCategoryModel.findOne({ name: name });
        if (exisitingSubCategory && exisitingSubCategory._id.toString() !== id) {
            return res.status(409).send({
                success: false,
                message: "Sub-Category already exist"
            });
        }

        // Check slug in Category
        const categoryWithSameSlug = await categoryModel.findOne({ slug });
        if (categoryWithSameSlug && categoryWithSameSlug._id.toString() !== id) {
            return res.status(409).send({
                success: false,
                message: "Slug already exist in categories",
            });
        }

        // Check slug in SubCategory
        const subCategoryWithSameSlug = await subCategoryModel.findOne({ slug });
        if (subCategoryWithSameSlug) {
            return res.status(409).send({
                success: false,
                message: "Slug already exist in sub-categories",
            });
        }

        //get updatedBy from logged-in user
        const updatedBy = req.user?._id;
        const category = await categoryModel.findByIdAndUpdate(
            id,
            { name, description, slug, updatedBy },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Category Update Error',
            error: error.message
        });
    }
};

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
        res.status(500).send({
            success: false,
            message: 'Error fetching categories',
            error: error.message
        })
    }
};


//delete parent and subcategory all together
export const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        await subCategoryModel.deleteMany({ parentCategory: id });

        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Category and related subcategories deleted successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error deleting category",
            error: error.message,
        });
    }
};

// Get categories with subcategories
export const getCategoriesWithSubsController = async (req, res) => {
    try {
        const data = await categoryModel.aggregate([
            // Lookup subcategories
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "parentCategory",
                    as: "subCategories"
                }
            },

            // Populate category createdBy
            {
                $lookup: {
                    from: "users",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "createdByDetails"
                }
            },
            { $unwind: { path: "$createdByDetails", preserveNullAndEmptyArrays: true } },

            // Populate category updatedBy
            {
                $lookup: {
                    from: "users",
                    localField: "updatedBy",
                    foreignField: "_id",
                    as: "updatedByDetails"
                }
            },
            { $unwind: { path: "$updatedByDetails", preserveNullAndEmptyArrays: true } },

            {
                $lookup: {
                    from: "users",
                    let: { subs: "$subCategories" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$subs.createdBy"] } } },
                        { $project: { _id: 1, name: 1, email: 1, avatar: 1 } }
                    ],
                    as: "subCreatedByUsers"
                }
            },
            {
                $lookup: {
                    from: "users",
                    let: { subs: "$subCategories" },
                    pipeline: [
                        { $match: { $expr: { $in: ["$_id", "$$subs.updatedBy"] } } },
                        { $project: { _id: 1, name: 1, email: 1, avatar: 1 } }
                    ],
                    as: "subUpdatedByUsers"
                }
            },
            {
                $addFields: {
                    subCategories: {
                        $map: {
                            input: "$subCategories",
                            as: "sub",
                            in: {
                                _id: "$$sub._id",
                                name: "$$sub.name",
                                slug: "$$sub.slug",
                                description: "$$sub.description",
                                parentCategory: "$$sub.parentCategory",
                                createdAt: "$$sub.createdAt",
                                updatedAt: "$$sub.updatedAt",

                                createdBy: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$subCreatedByUsers",
                                                as: "u",
                                                cond: { $eq: ["$$u._id", "$$sub.createdBy"] }
                                            }
                                        },
                                        0
                                    ]
                                },

                                updatedBy: {
                                    $arrayElemAt: [
                                        {
                                            $filter: {
                                                input: "$subUpdatedByUsers",
                                                as: "u",
                                                cond: { $eq: ["$$u._id", "$$sub.updatedBy"] }
                                            }
                                        },
                                        0
                                    ]
                                }
                            }
                        }
                    }
                }
            },

            // Final projection
            {
                $project: {
                    _id: 1,
                    name: 1,
                    slug: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,

                    createdBy: {
                        _id: "$createdByDetails._id",
                        name: "$createdByDetails.name",
                        email: "$createdByDetails.email",
                        avatar: "$createdByDetails.avatar"
                    },

                    updatedBy: {
                        _id: "$updatedByDetails._id",
                        name: "$updatedByDetails.name",
                        email: "$updatedByDetails.email",
                        avatar: "$updatedByDetails.avatar"
                    },

                    subCategories: 1
                }
            }
        ]);

        res.status(200).send({
            success: true,
            categories: data
        });

    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Error loading categories with populated subcategories",
            error: error.message
        });
    }
};
