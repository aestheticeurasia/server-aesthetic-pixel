import JWT from 'jsonwebtoken'
import userModel from '../model/userModel.js';

//protected Route token base
export const requireSignIn = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided"
            });
        }

        const token = authHeader.split(" ")[1];

        const decode = JWT.verify(token, process.env.JWT_SECRET);
        req.user = decode;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


//check if admin
export const isAdmin = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id)
        if (user.role !== "Admin") {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            })
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in Admin",
            error
        })
    }
}

//check if moderator
export const isModerator = async (req, res, next) => {
    try {
        const user = await userModel.findById(req.user._id);
        if (user.role !== "Moderator" && user.role !== "Admin") {
            return res.status(401).send({
                success: false,
                message: "Unauthorized Access"
            });
        } else {
            next();
        }
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success: false,
            message: "Error in Moderator Access",
            error
        });
    }
};