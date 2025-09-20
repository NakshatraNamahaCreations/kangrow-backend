const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const fs = require('fs');
const path = require('path');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// ➤ Register Admin
exports.registerAdmin = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, error: 'Passwords do not match' });
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    let profilePicture = null;
    if (req.file) {
      profilePicture = `/uploads/admins/${req.file.filename}`; // Store relative path
    }

    const admin = new Admin({ username, email, password, profilePicture });
    await admin.save();

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token: generateToken(admin._id),
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        profilePicture: admin.profilePicture ? `https://api.svkangrowhealth.com${admin.profilePicture}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Login Admin
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.matchPassword(password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(admin._id),
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        profilePicture: admin.profilePicture ? `https://api.svkangrowhealth.com${admin.profilePicture}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Update Profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }

    if (username) admin.username = username;
    if (email) admin.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      // Delete old profile picture if it exists
      if (admin.profilePicture && fs.existsSync(path.join(__dirname, '..', admin.profilePicture))) {
        fs.unlinkSync(path.join(__dirname, '..', admin.profilePicture));
      }
      admin.profilePicture = `/uploads/admins/${req.file.filename}`; // Store relative path
    }

    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        profilePicture: admin.profilePicture ? `https://api.svkangrowhealth.com${admin.profilePicture}` : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};