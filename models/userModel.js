// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     uniqueId: {
//       type: String,

//       unique: true,
//     },
//     name: {
//       type: String,
//       required: [true, "Name is required"],
//       trim: true,
//     },
//     phoneNumber: {
//       type: String,
//       required: [true, "Phone number is required"],
//       // unique: true,
//       match: [/^\d{10}$/, "Phone number must be 10 digits"],
//     },

//     email: {
//       type: String,
//       required: [true, "Email is required"],
//       // unique: true,
//       match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
//     },
//     dateOfBirth: {
//       type: Date,
//       required: [true, "Date of birth is required"],
//     },
//     gender: {
//       type: String,
//       required: [true, "Gender is required"],
//       enum: ["male", "female", "other"],
//     },
//     age: {
//       type: Number,
//       required: [true, "Age is required"],
//       min: [0, "Age cannot be negative"],
//     },
//     father: {
//       type: String,
//     },
//     mother: {
//       type: String,
//     },
//     status: {
//       type: String,
//       required: [true, "Status is required"],
//       enum: ["subscribe", "unsubscribe"],
//       default: "unsubscribe",
//     },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   if (this.isNew) {
//     try {
//       const count = await this.constructor.countDocuments();
//       this.uniqueId = `KH${String(count + 1).padStart(3, "0")}`;
//       next();
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     next();
//   }
// });

// module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

// Counter schema for safe auto-increment
const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  value: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", counterSchema);

const userSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, unique: true },
    name: { type: String, required: [true, "Name is required"], trim: true },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],
      unique: true,
    },
    place: { type: String, required: [true, "Place is required"], trim: true },
    dateOfBirth: { type: Date, required: [true, "Date of birth is required"] },
    gender: {
      type: String,
      required: [true, "Gender is required"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    father: { type: String },
    mother: { type: String },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["subscribe", "unsubscribe"],
      default: "unsubscribe",
    },
  },
  { timestamps: true }
);

// Pre-save hook for generating uniqueId
userSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      let counter = await Counter.findOneAndUpdate(
        { name: "userId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );

      this.uniqueId = `KH${String(counter.value).padStart(3, "0")}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

module.exports = mongoose.model("User", userSchema);
