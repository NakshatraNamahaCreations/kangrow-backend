// controllers/schoolController.js
const School = require('../models/schoolModel');

// ➤ Create School
exports.createSchool = async (req, res) => {
  try {
    const { schoolName } = req.body;

    // Check duplicate
    const existingSchool = await School.findOne({ schoolName });
    if (existingSchool) {
      return res.status(400).json({ success: false, error: 'School already exists' });
    }

    const school = new School({ schoolName });
    await school.save();

    res.status(201).json({
      success: true,
      message: 'School created successfully',
      school,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Get All Schools
exports.getAllSchools = async (req, res) => {
  try {
    const schools = await School.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, schools });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ➤ Count All Schools
exports.countSchools = async (req, res) => {
  try {
    const count = await School.countDocuments({});
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Update School
exports.updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolName } = req.body;

    const updatedSchool = await School.findByIdAndUpdate(
      id,
      { schoolName },
      { new: true, runValidators: true }
    );

    if (!updatedSchool) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    res.status(200).json({
      success: true,
      message: 'School updated successfully',
      school: updatedSchool,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Delete School
exports.deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSchool = await School.findByIdAndDelete(id);
    if (!deletedSchool) {
      return res.status(404).json({ success: false, error: 'School not found' });
    }

    res.status(200).json({
      success: true,
      message: 'School deleted successfully',
      school: deletedSchool,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
