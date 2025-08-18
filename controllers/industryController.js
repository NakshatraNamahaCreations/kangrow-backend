// controllers/industryController.js
const Industry = require('../models/industryModel');

// ➤ Create Industry
exports.createIndustry = async (req, res) => {
  try {
    const { industryName } = req.body;

    const existingIndustry = await Industry.findOne({ industryName });
    if (existingIndustry) {
      return res.status(400).json({ success: false, error: 'Industry already exists' });
    }

    const industry = new Industry({ industryName });
    await industry.save();

    res.status(201).json({
      success: true,
      message: 'Industry created successfully',
      industry,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Get All Industries
exports.getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, industries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Update Industry
exports.updateIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const { industryName } = req.body;

    const updatedIndustry = await Industry.findByIdAndUpdate(
      id,
      { industryName },
      { new: true, runValidators: true }
    );

    if (!updatedIndustry) {
      return res.status(404).json({ success: false, error: 'Industry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Industry updated successfully',
      industry: updatedIndustry,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// ➤ Count All Industries
exports.countIndustries = async (req, res) => {
  try {
    const count = await Industry.countDocuments({});
    res.status(200).json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ➤ Delete Industry
exports.deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIndustry = await Industry.findByIdAndDelete(id);
    if (!deletedIndustry) {
      return res.status(404).json({ success: false, error: 'Industry not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Industry deleted successfully',
      industry: deletedIndustry,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
