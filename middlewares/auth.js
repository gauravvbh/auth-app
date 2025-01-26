const jwt = require("jsonwebtoken")
require("dotenv").config();


//Authentication
exports.auth = (req, res, next) => {
    try {
        // const token = req.body.token;
        const token = req.cookies.token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decode)
            req.user = decode;
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}


//Authorization for user routes
exports.isUser = (req, res, next) => {
    try {
        if (req.user.role !== "User") {
            return res.status(401).json({
                success: false,
                message: "This is a protected route for Users, you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while validating user"
        })
    }
}

//Authorization for admin routes
exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Admins, you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}