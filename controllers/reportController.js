
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const UserReport = require('../models/reportModel');
const mongoose = require("mongoose");


// controllers/userReportController.js
exports.bulkUploadUserReports = async (req, res) => {
  try {
    const { reportType } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, error: 'No files uploaded' });
    }

    let successUploads = [];
    let failedUploads = [];

    for (const file of req.files) {
      try {
        let fileBaseName = path.parse(file.originalname).name;
        let matchedId = fileBaseName.match(/KH\d+/i);
        let userUniqueId = matchedId ? matchedId[0] : fileBaseName;

        const user = await User.findOne({ uniqueId: userUniqueId });
        if (!user) {
          failedUploads.push({ file: file.originalname, reason: 'User not found' });
          fs.unlinkSync(file.path);
          continue;
        }

        const ext = path.extname(file.originalname);
        const newFileName = `${reportType.replace(/\s+/g, '')}-${userUniqueId}${ext}`;
        const newPath = path.join('uploads', newFileName);
        fs.renameSync(file.path, newPath);

        const report = new UserReport({
          userId: user._id,
          userUniqueId,
          reportType,
          fileName: newFileName,
          filePath: newPath,
          mimeType: file.mimetype,
          size: file.size,
          category: req.body.category,  // ✅ store category
  entity: req.body.entity, 
        });
        await report.save();

        successUploads.push({
          _id: report._id, // Include the report's _id
          user: user.name,
          userUniqueId,
          fileName: newFileName,
          reportType, // Include reportType to match frontend expectations
          category: req.body.category, // Include category if sent from frontend
          entity: req.body.entity, // Include entity if sent from frontend
        });
      } catch (error) {
        failedUploads.push({ file: file.originalname, reason: error.message });
      }
    }

    res.status(201).json({
      success: true,
      uploadedCount: successUploads.length,
      failedCount: failedUploads.length,
      successUploads,
      failedUploads,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// controllers/userReportController.js
exports.deleteUserReport = async (req, res) => {
  try {
    // ✅ Directly use req.params.id (Mongoose will handle ObjectId internally)
    const deletedReport = await UserReport.findByIdAndDelete(req.params.id);

    if (!deletedReport) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    res.status(200).json({ success: true, message: "Report deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUserReport:", error);
    res.status(500).json({ success: false, error: "Failed to delete report" });
  }
};




exports.getAllReports = async (req, res) => {
  try {
    const reports = await UserReport.find()
      .sort({ createdAt: -1 }); // ✅ latest first

    res.status(200).json({
      success: true,
      reports: reports.map((report) => ({
        _id: report._id,
        userUniqueId: report.userUniqueId,
        reportType: report.reportType,
        fileName: report.fileName,
        category: report.category,
        entity: report.entity,
        createdAt: report.createdAt,
      })),
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// controllers/userReportController.js
exports.getLatestReportByUserUniqueId = async (req, res) => {
  try {
    const { userUniqueId } = req.params;

    if (!userUniqueId) {
      return res.status(400).json({ success: false, error: "UserUniqueId is required" });
    }

    // Fetch the latest report (most recent createdAt)
    const latestReport = await UserReport.findOne({ userUniqueId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    if (!latestReport) {
      return res.status(404).json({ success: false, error: "No reports found for this user" });
    }

    // Fetch all reports for this user (most recent first)
    const allReports = await UserReport.find({ userUniqueId })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.status(200).json({
      success: true,
      latestReport: {
        _id: latestReport._id,
        userUniqueId: latestReport.userUniqueId,
        reportType: latestReport.reportType,
        category: latestReport.category,
        entity: latestReport.entity,
        fileName: latestReport.fileName,
        filePath: latestReport.filePath,
        mimeType: latestReport.mimeType,
        size: latestReport.size,
        uploadedAt: latestReport.createdAt,
        user: latestReport.userId,
      },
      allReports: allReports.map((report) => ({
        _id: report._id,
        userUniqueId: report.userUniqueId,
        reportType: report.reportType,
        category: report.category,
        entity: report.entity,
        fileName: report.fileName,
        filePath: report.filePath,
        mimeType: report.mimeType,
        size: report.size,
        uploadedAt: report.createdAt,
        user: report.userId,
      })),
    });
  } catch (error) {
    console.error("Error fetching latest report:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// New: Update report
exports.updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { reportType } = req.body;

    const updatedReport = await UserReport.findByIdAndUpdate(
      id,
      { reportType },
      { new: true, runValidators: true }
    );

    if (!updatedReport) {
      return res.status(404).json({ success: false, error: "Report not found" });
    }

    res.status(200).json({
      success: true,
      message: "Report updated successfully",
      report: updatedReport,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
