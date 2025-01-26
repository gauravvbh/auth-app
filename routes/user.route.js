const express = require('express')
const router = express.Router();

const { signup, signin, getUsers, deleteUserById, getUserById } = require("../controllers/user");
const { auth, isAdmin, isUser } = require("../middlewares/auth")



router.post("/signup", signup);
router.post("/signin", signin);
router.get("/getall", auth, isAdmin, getUsers);
router.get("/user/:id", auth, getUserById);
router.delete("/delete/:id", auth, isAdmin, deleteUserById);



// Testing Route for Middleware
router.get("/test", auth, (req, res) => {
    res.json({
        success: true,
        message: "Test successful"
    })
})

// Protected Route for Student
router.get("/user", auth, isUser, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for User"
    })
});

// Protected Route for Admin 
router.get("/admin", auth, isAdmin, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Protected Route for Admin"
    })
});

module.exports = router;