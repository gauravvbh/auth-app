const bcrypt = require('bcrypt');
const User = require("../models/user.model");
const jwt = require("jsonwebtoken")
const { signInValidation, signUpValidation } = require('../schemas/user.schema')

require("dotenv").config()

exports.signup = async (req, res) => {
    try {
        //input validation
        const { error } = signUpValidation(req.body);
        if (error) return res.status(400).json({
            message: error.details[0].message
        });


        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User Already Exists",
            })
        }

        //any user can't able to create a new account with the admin role explicitly
        if (role === "Admin") {
            return res.status(403).json({
                success: false,
                message: "Can't create admin account"
            })
        }


        let hashedPassword;
        try {
            //hashing the password
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: "Error in hashing password",
            })
        }


        let user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        });

        //undefined the password before sending the user details to the frontend
        user.password = undefined;
        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user
        });
    }
    catch (err) {
        // console.error(err)
        return res.status(500).json({
            success: false,
            message: "User cannot be register, Please try again later",
        })
    }
}


exports.signin = async (req, res) => {
    try {
        const { error } = signInValidation(req.body);
        if (error) return res.status(400).json({
            message: error.details[0].message
        });

        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User does not exist, Sign up first",
            });
        }

        //details to be stored in the token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.role,
        };

        let isMatch = bcrypt.compare(password, user.password);

        if (isMatch) {
            let token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h",
            });
            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            //saving the token into the cookie
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User logged in successfully"
            });
        }
        else {
            return res.status(403).json({
                success: false,
                message: "Password does not match",
            })
        }
    }
    catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: "Error while logging in",
        })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        for (let user in users) {
            //undefined the password for every users before sending the details to the frontend
            users[user].password = undefined;
        }
        res.status(200).json({
            success: true,
            users
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({
            message: 'User not found'
        });

        user.password = undefined;
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({
            message: 'User not found'
        });
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}