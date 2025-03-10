const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // ✅ Import jsonwebtoken
const User = require("../models/user");
const authMiddleware = require("../middleware/auth");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

// User Sign-up
router.post("/sign_up", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required", type: "error" });
        }
        if (username.length < 3) {
            return res.status(400).json({ message: "Username should have at least 3 characters", type: "error" });
        }

        const existingUsername = await User.findOne({ username });
        const existingEmail = await User.findOne({ email });

        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists", type: "error" });
        }
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists", type: "error" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        return res.status(201).json({ message: "User registered successfully", type: "success" });

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "Internal server error", type: "error" });
    }
});

// User Login
router.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required", type: "error" });
        }

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found", type: "error" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials", type: "error" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            id: user._id,
            token,
            message: "Login successfully!",
            type: "success"

        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Internal server error", type: "error" });
    }
});
router.get('/profile',authMiddleware,async (req,res) => {
    try {
        const {userId} = req.user
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message:"User not Found",type:"error"})
        }
        res.status(200).json(user)
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Internal server error", type: "error" });
    }
})
module.exports = router;
