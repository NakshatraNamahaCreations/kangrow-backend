const XLSX = require("xlsx");
const fs = require("fs");
const User = require("../models/userModel");
const moment = require("moment");
const { log } = require("console");

exports.registerUser = async (req, res) => {
  try {
    const {
      name,
      phoneNumber,
      dateOfBirth,
      gender,
      age,
      father,
      mother,
      place,
      status,
    } = req.body;

    // ✅ Check if email or phone already exists
    const existingUser = await User.findOne({
      $or: [{ phoneNumber }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "User with this email or phone number already exists",
      });
    }

    // ✅ Create new user
    const user = new User({
      name,
      phoneNumber,

      dateOfBirth,
      gender,
      age,
      father,
      mother,
      place,
      status,
    });

    await user.save();

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        uniqueId: user.uniqueId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        age: user.age,
        father: user.father,
        mother: user.mother,
        place: user.place,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};

// exports.bulkUploadUsers = async (req, res) => {
//   try {
//     if (!req.file) {
//       return res
//         .status(400)
//         .json({ success: false, error: "No file uploaded" });
//     }

//     const workbook = XLSX.readFile(req.file.path);
//     const sheetName = workbook.SheetNames[0];
//     const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

//     let insertedUsers = [];
//     let failedUsers = [];

//     for (const row of sheetData) {
//       try {
//         const name = row.Name;
//         const phoneNumber = row.Phone;
//         const gender = row.Gender;
//         const age = row.Age;
//         const father = row.Father; // Updated to match Excel column name
//         const mother = row.Mother;
//         const place = row.Place;

//         // ✅ Handle DOB (string or Excel serial)
//         let dateOfBirth;
//         if (typeof row.DOB === "string") {
//           dateOfBirth = moment(row.DOB, "DD-MM-YYYY").toDate();
//         } else if (typeof row.DOB === "number") {
//           dateOfBirth = new Date((row.DOB - 25569) * 86400 * 1000);
//         } else {
//           throw new Error("Invalid DOB format");
//         }

//         // ✅ Check duplicates
//         const existingUser = await User.findOne({
//           $or: [{ phoneNumber }],
//         });
// console.log(
//   existingUser,"existingUser"
// )
//         if (existingUser) {
//           failedUsers.push({
//             ...row,
//             DOB: moment(dateOfBirth).format("YYYY-MM-DD"),
//             reason: "Duplicate email or phone number",
//           });
//           continue;
//         }

//         const user = new User({
//           name,
//           phoneNumber,
//           dateOfBirth,
//           gender,
//           age,
//           father,
//           mother,
//           place,
//           status: row.status || "unsubscribe",
//         });

//         await user.save();

//         insertedUsers.push({
//           uniqueId: user.uniqueId,
//           name: user.name,

//           dateOfBirth: moment(user.dateOfBirth).format("YYYY-MM-DD"),
//           father: user.father, // Include in response
//           mother: user.mother,
//           place: user.place,
//           status: user.status,
//         });
//       } catch (err) {
//         failedUsers.push({ ...row, reason: err.message });
//       }
//     }

//     fs.unlinkSync(req.file.path);

//     res.status(201).json({
//       success: true,
//       insertedCount: insertedUsers.length,
//       failedCount: failedUsers.length,
//       insertedUsers,
//       failedUsers,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// exports.loginUser = async (req, res) => {
//   try {
//     const { name, dateOfBirth } = req.body;


//     if (!name || !dateOfBirth) {
//       return res.status(400).json({
//         success: false,
//         error: "Name and date of birth are required",
//       });
//     }


//     const user = await User.findOne({
//       name,
//       dateOfBirth: new Date(dateOfBirth),
//     });

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         error: "Invalid name or date of birth",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: {
//         _id: user._id,
//         uniqueId: user.uniqueId,
//         name: user.name,
//         phoneNumber: user.phoneNumber,
//         dateOfBirth: user.dateOfBirth,
//         gender: user.gender,
//         age: user.age,
//         father: user.father,
//         mother: user.mother,
//         place: user.place,
//         status: user.status,
//       },
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
exports.bulkUploadUsers = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let insertedUsers = [];
    let failedUsers = [];

    for (const row of sheetData) {
      console.log(
        row
      )
      try {
        const name = row.Name ? String(row.Name).trim() : null;
        const phoneNumber = row.Phone ? String(row.Phone).trim() : null;
        const gender = row.Gender ? String(row.Gender).trim() : null;
        const age = row.Age || null;
        const father = row.Father ? String(row.Father).trim() : null;
        const mother = row.Mother ? String(row.Mother).trim() : null;
        const place = row.Place ? String(row.Place).trim() : null;
        const category = row.Category ? String(row.Category).trim() : null;
        const status = row.status ? String(row.status).trim() : null;

        // ✅ Handle DOB (string or Excel serial)
        let dateOfBirth;
        if (typeof row.DOB === "string") {
          dateOfBirth = moment(row.DOB, "DD-MM-YYYY").toDate();
        } else if (typeof row.DOB === "number") {
          dateOfBirth = new Date((row.DOB - 25569) * 86400 * 1000);
        } else {
          throw new Error("Invalid DOB format");
        }

        // ✅ Validate phone number
        if (!phoneNumber) {
          failedUsers.push({ ...row, reason: "Missing phone number" });
          continue;
        }

        // ✅ Check duplicates (by phoneNumber OR name+dob combo)
        const existingUser = await User.findOne({
          $or: [
            { phoneNumber },
            { name, dateOfBirth }
          ],
        });

        if (existingUser) {
          failedUsers.push({
            ...row,
            DOB: moment(dateOfBirth).format("YYYY-MM-DD"),
            reason: "Duplicate phone number or same name + DOB",
          });
          continue;
        }
// console.log(
//   status,"status"
// )
        // ✅ Create new user
        const user = new User({
          name,
          phoneNumber,
          dateOfBirth,
          gender,
          age,
          father,
          mother,
          place,
          category,
          status: status || "unsubscribe",
        });

        await user.save();

        insertedUsers.push({
          uniqueId: user.uniqueId,
          name: user.name,
          dateOfBirth: moment(user.dateOfBirth).format("YYYY-MM-DD"),
          father: user.father,
          mother: user.mother,
          place: user.place,
          status: user.status,
          category:user.category,
        });
      } catch (err) {
        failedUsers.push({ ...row, reason: err.message });
      }
    }

    // delete uploaded file from /uploads
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      insertedCount: insertedUsers.length,
      failedCount: failedUsers.length,
      insertedUsers,
      failedUsers,
    });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { name, dateOfBirth } = req.body;
    console.log("dateOfBirth", dateOfBirth);

    if (!name || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        error: "Name and date of birth are required",
      });
    }

    // Normalize the name to lower case and remove spaces
    const normalizedName = name.replace(/\s+/g, '').toLowerCase();

    // Convert the date of birth to a valid format (e.g., 'yyyy-mm-dd')
    const [day, month, year] = dateOfBirth.split('-');
    const normalizedDateOfBirth = new Date(`${year}-${month}-${day}T00:00:00Z`); // Use UTC format here

    console.log("normalizedName", normalizedName);
    console.log("normalizedDateOfBirth", normalizedDateOfBirth);

    // Start and end of the day in UTC
    const startOfDay = new Date(normalizedDateOfBirth);
    const endOfDay = new Date(normalizedDateOfBirth);
    endOfDay.setHours(23, 59, 59, 999); 

    console.log("startOfDay", startOfDay);
    console.log("endOfDay", endOfDay);



const normalizedInput = name.replace(/\s/g, ''); 


const regex = new RegExp(`^${normalizedInput.split('').join('\\s*')}$`, 'i');
    
    const user = await User.findOne({
      name: regex, 
      dateOfBirth: { $gte: startOfDay, $lt: endOfDay },  
    });

    

    console.log("user", user);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "Invalid name or date of birth",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        uniqueId: user.uniqueId,
        name: user.name,
        phoneNumber: user.phoneNumber,
        dateOfBirth: user.dateOfBirth,
        gender: user.gender,
        age: user.age,
        father: user.father,
        mother: user.mother,
        place: user.place,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};



exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from URL
    const updates = req.body;

    // Prevent email/phone duplicates
    if (updates.phoneNumber) {
      const existingUser = await User.findOne({
        _id: { $ne: id }, // Exclude current user
        $or: [{ phoneNumber: updates.phoneNumber }].filter(Boolean),
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "Another user with this email or phone number already exists",
        });
      }
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.getUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ uniqueId: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      status: user.status, // Return the user's status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
