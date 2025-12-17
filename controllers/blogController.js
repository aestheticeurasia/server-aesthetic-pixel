import blogModel from "../model/blogModel.js";
import slugify from 'slugify';
import { deleteFromS3 } from '../config/deleteFromS3.js';

export const createBlogController = async (req, res) => {
    try {
        const { title, slug, category, subCategory, jsonContent, excerpt, metaDescription, status, publishedAt } = req.body;

        // Get coverPhoto from S3 + CloudFront
        let coverPhotoUrl = null;

        if (req.file) {
            const fileKey = req.file.key;

            // CloudFront URL
            coverPhotoUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${fileKey}`;
        }

        const newBlog = await new blogModel({
            title,
            slug: slugify(title),
            category,
            subCategory,
            coverPhoto: coverPhotoUrl,
            jsonContent,
            excerpt,
            metaDescription,
            status,
            publishedAt,
            createdBy: req.user._id,
        }).save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            newBlog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating blog",
            error: error.message,
        });
    }
};

//get all blogs controller
export const getAllBlogsController = async (req, res) => {
    try {

        const blogs = await blogModel.find({})
            .populate("createdBy", "name email")
            .populate("category", "name")
            .populate("subCategory", "name")
            .sort({ createdAt: -1 });

        //send response
        res.status(200).json({
            success: true,
            message: "All blogs fetched successfully",
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching blogs",
        });
    }
};

//delete blog
export const deleteBlogController = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await blogModel.findById(id);

        // Delete coverPhoto from S3 if exists
        if (blog.coverPhoto) {
            // cloudfront
            const fileKey = blog.coverPhoto.replace(
                `https://${process.env.CLOUDFRONT_DOMAIN}/`,
                ""
            );
            await deleteFromS3(fileKey);
        };

        await blogModel.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting blog",
        });
    }
};