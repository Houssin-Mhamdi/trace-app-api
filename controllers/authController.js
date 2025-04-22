const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'yourSecretKey'; // Ideally, use process.env.JWT_SECRET

// Register
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Optionally check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ email, password }); // In real app, hash password
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      message: "User registered",
      user: { _id: user._id, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password }); // Use hashed password in production
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: "Login successful",
      user: { _id: user._id, email: user.email, role: user.role },  
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
