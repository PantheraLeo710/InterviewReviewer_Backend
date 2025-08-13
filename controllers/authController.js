// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');

// ===== Signup Controller =====
exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    // Basic field validation
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();

        const token = jwt.sign(
            {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isStaff: newUser.isStaff
            },
            JWT_SECRET,
            { expiresIn: '10h' }
        );

        res.status(201).json({
            message: 'User created successfully!',
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                isStaff: newUser.isStaff
            }
        });
    } catch (err) {
        console.error('Signup Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// ===== Login Controller =====
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        console.log('JWT_SECRET:', JWT_SECRET);

        const token = jwt.sign(
            {
                id: user._id,
                name: user.name,
                email: user.email,
                isStaff: user.isStaff
            },
            JWT_SECRET,
            { expiresIn: '10h' }
        );


        

        res.json({  token,user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isStaff: user.isStaff
            }
        });
    } catch (err) {
        console.error('Login Error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};
