// controllers/instituteController.js
const Institute = require('../models/instituteModel');

// ➤ Create Institute
exports.createInstitute = async (req, res) => {
  try {
    const { instituteName } = req.body;

    const existingInstitute = await Institute.findOne({ instituteName });
    if (existingInstitute) {
      return res.status(400).json({ success: false, error: 'Institute already exists' });
    }

    const institute = new Institute({ instituteName });
    await institute.save();

    res.status(201).json({
      success: true,
      message: 'Institute created successfully',
      institute,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Get All Institutes
exports.getAllInstitutes = async (req, res) => {
  try {
    const institutes = await Institute.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, institutes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Update Institute
exports.updateInstitute = async (req, res) => {
  try {
    const { id } = req.params;
    const { instituteName } = req.body;

    const updatedInstitute = await Institute.findByIdAndUpdate(
      id,
      { instituteName },
      { new: true, runValidators: true }
    );

    if (!updatedInstitute) {
      return res.status(404).json({ success: false, error: 'Institute not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Institute updated successfully',
      institute: updatedInstitute,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ➤ Count All Institutes
exports.countInstitutes = async (req, res) => {
  try {
    const count = await Institute.countDocuments({});
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ➤ Delete Institute
exports.deleteInstitute = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedInstitute = await Institute.findByIdAndDelete(id);
    if (!deletedInstitute) {
      return res.status(404).json({ success: false, error: 'Institute not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Institute deleted successfully',
      institute: deletedInstitute,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
