export const createBlogController = async (req, res) => {
    try {
        const { title, slug, category, subCategory, jsonContent, excerpt, metaDescription, status } = req.body;
        const coverPhoto = req.file ? req.file.location : null;
        const newBlog = new BlogModel({
            title,
            slug,
            category,
            subCategory,
            coverPhoto,
            jsonContent,
            excerpt,
            metaDescription,
            status,
            createdBy: req.user._id,
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog: newBlog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating blog",
            error: error.message,
        });
    }
};