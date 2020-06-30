const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    EmailIsVerified: { type: Boolean, default: false },
    Email: { type: String, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },
    Password: { type: String },
    FirstName: { type: String, default: null },
    LastName: { type: String, default: null },
    UserType: {
      type: String,
      enum: ["Student", "Faculty", "Manager"],
      default: "Student"
    },
    Bio: { type: String, default: null },
    Phone: { type: String, maxlength: 12, default: null, unique: true },
    IsActive: { type: Boolean, default: true },
    Centre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "centre"
    },
    Address: { type: String, default: null },
    ProfilePicture: {
      type: String,
      default:
        "1581684886277computer-icons-user-profile-clip-art-portable-network-graphics-png-favpng-YEj6NsJygkt6nFTNgiXg9fg9w.jpg"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
