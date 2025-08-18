const Team = require('../models/teamModel');
const bcrypt = require('bcryptjs');

// ➤ Create Team Member
exports.createTeamMember = async (req, res) => {
  try {
    const { name, email, password, status, role,selectedSidebarLinks  } = req.body;

    const existingMember = await Team.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const member = new Team({ name, email, password: hashedPassword, status, role, selectedSidebarLinks  });
    await member.save();

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      member: { ...member._doc, password: undefined },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Get All Team Members
exports.getAllTeamMembers = async (req, res) => {
  try {
    const members = await Team.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, members });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Login Team Member
// exports.loginTeamMember = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const member = await Team.findOne({ email });
//     if (!member) {
//       return res.status(401).json({ success: false, error: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(password, member.password);
//     if (!isMatch) {
//       return res.status(401).json({ success: false, error: 'Invalid email or password' });
//     }

//     if (member.status !== 'active') {
//       return res.status(403).json({ success: false, error: 'Account is inactive' });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Login successful',
//       member: { ...member._doc, password: undefined },
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// ➤ Login Team Member
exports.loginTeamMember = async (req, res) => {
  try {
    const { email, password } = req.body;

    const member = await Team.findOne({ email });
    if (!member) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    if (member.status !== 'active') {
      return res.status(403).json({ success: false, error: 'Account is inactive' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      member: { 
        email: member.email, 
        role: member.role, 
        name: member.name,
        selectedSidebarLinks: member.selectedSidebarLinks || [], // ✅ send links
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};



// ➤ Update Team Member
exports.updateTeamMember = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedMember = await Team.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Team member updated successfully',
      member: updatedMember,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Delete Team Member
exports.deleteTeamMember = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMember = await Team.findByIdAndDelete(id).select('-password');
    if (!deletedMember) {
      return res.status(404).json({ success: false, error: 'Team member not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Team member deleted successfully',
      member: deletedMember,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};