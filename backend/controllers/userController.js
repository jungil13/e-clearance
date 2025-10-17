import User from "../models/userModel.js";
import db from "../config/db.js";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { getIO } from "../config/socket.js";

// Gmail transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brgybangbang2025@gmail.com",
    pass: "kjmkxavolewszzsz",  
  },
});
// ---------------- Multer Setup ----------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } }); // max 2MB

// ---------------- Register ----------------
export const registerUser = async (req, res) => {
  try {
    const {
      first_name,
      middle_name,
      last_name,
      age,
      gender,
      email,
      username,
      password,
      purok,
      civil_status,
      address
    } = req.body;

    const valid_id = req.file ? req.file.filename : null;

    // Validate required fields
    if (!first_name || !last_name || !email || !username || !password || !purok || !civil_status || !address) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      first_name,
      middle_name,
      last_name,
      age,
      gender,
      email,
      valid_id,
      username,
      password: hashedPassword,
      purok,
      civil_status,
      address
    };

    const user = await User.create(newUser); // make sure this returns the created user

    // Emit socket event using global IO
    try {
      const io = getIO();
      io.emit("newUser", {
        message: `🆕 New user registered: ${first_name} ${last_name}`,
      });
      console.log("✅ Emitted socket event: newUser");
    } catch (socketErr) {
      console.error("Socket.IO not initialized:", socketErr.message);
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};


// ---------------- Login ----------------
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Please enter username and password" });

    const user = await User.findByUsername(username);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check user status (only Approved can log in)
    if (user.status === "Pending") {
      return res.status(403).json({ message: "Your account is still pending approval." });
    } else if (user.status === "Rejected") {
      return res.status(403).json({ message: "Your account has been rejected. Please contact the barangay administrator." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        user_type: user.user_type,
        status: user.status, // included in payload
      },
      "secretkey",
      { expiresIn: "24h" }
    );

    // Send response
    res.json({
      message: "Login successful",
      token,
      user_type: user.user_type,
      user: {
        id: user.id,
        full_name: `${user.first_name} ${user.last_name}`,
        purok: user.purok,
        status: user.status, // include for frontend logic
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};



// ---------------- Get Profile ----------------
export const getProfile = (req, res) => {
  const userId = req.user.id;

  db.query(
    `SELECT 
       id, first_name, middle_name, last_name, age, gender, 
       civil_status, purok, address, email, valid_id, username, created_at
     FROM users 
     WHERE id = ?`,
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.message });
      if (!result.length) return res.status(404).json({ message: "User not found" });
      res.json(result[0]);
    }
  );
};

// ---------------- Update Profile ----------------
export const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { first_name, middle_name, last_name, age, gender, email, purok, civil_status, address } = req.body;
  const valid_id = req.file ? req.file.filename : null;

  const query =
    "UPDATE users SET first_name=?, middle_name=?, last_name=?, age=?, gender=?, email=?, purok=?, civil_status=?, address=?"
    + (valid_id ? ", valid_id=?" : "")
    + " WHERE id=?";

  const params = [first_name, middle_name, last_name, age, gender, email, purok, civil_status, address];
  if (valid_id) params.push(valid_id);
  params.push(userId);

  db.query(query, params, (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json({ message: "Profile updated successfully" });
  });
};
// ---------------- Change Password ----------------
export const changePassword = async (req, res) => {
  const userId = req.user.id;
  const { current_password, new_password } = req.body;

  if (!current_password || !new_password)
    return res.status(400).json({ message: "Please provide current and new password" });

  db.query("SELECT password FROM users WHERE id=?", [userId], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    if (!result.length) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(current_password, result[0].password);
    if (!isMatch) return res.status(401).json({ message: "Current password is incorrect" });

    const hashedPassword = await bcrypt.hash(new_password, 10);
    db.query("UPDATE users SET password=? WHERE id=?", [hashedPassword, userId], (err) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.message });
      res.json({ message: "Password updated successfully" });
    });
  });
};


export const getAllUsers = (req, res) => {
  const search = req.query.search ? `%${req.query.search}%` : "%";
  const limit = parseInt(req.query.limit) || 10;
  const page = parseInt(req.query.page) || 1;
  const offset = (page - 1) * limit;

  // Fetch all fields
  const selectQuery = `
    SELECT 
      id, first_name, middle_name, last_name, age, gender, civil_status,
      purok, address, email, valid_id, username, password, created_at, 
      user_type, status
    FROM users
    WHERE 
      first_name LIKE ? OR 
      middle_name LIKE ? OR 
      last_name LIKE ? OR 
      email LIKE ? OR 
      username LIKE ?
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  db.query(
    selectQuery,
    [search, search, search, search, search, limit, offset],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Database error", error: err.message });

      // Get total count for pagination
      const countQuery = `
        SELECT COUNT(*) AS total 
        FROM users
        WHERE 
          first_name LIKE ? OR 
          middle_name LIKE ? OR 
          last_name LIKE ? OR 
          email LIKE ? OR 
          username LIKE ?
      `;

      db.query(
        countQuery,
        [search, search, search, search, search],
        (err2, countResult) => {
          if (err2) return res.status(500).json({ message: "Database error", error: err2.message });

          res.json({
            data: results,
            total: countResult[0].total,
            page,
            limit,
          });
        }
      );
    }
  );
};

export const updateUserStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  console.log(`🟡 Received request to update status for user ID: ${id} → ${status}`);

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    console.log("❌ Invalid status value received.");
    return res.status(400).json({ message: "Invalid status value" });
  }

  // Fetch user details first
  const getUserQuery = "SELECT email, first_name FROM users WHERE id = ?";
  db.query(getUserQuery, [id], (err, results) => {
    if (err) {
      console.error("❌ Database error while fetching user:", err);
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    if (results.length === 0) {
      console.log("⚠️ User not found for ID:", id);
      return res.status(404).json({ message: "User not found" });
    }

    const { email, first_name } = results[0];
    console.log(`✅ Found user: ${first_name || "N/A"} (${email})`);

    // Update user status
    const updateQuery = "UPDATE users SET status = ? WHERE id = ?";
    db.query(updateQuery, [status, id], async (err2) => {
      if (err2) {
        console.error("❌ Database error while updating status:", err2);
        return res.status(500).json({ message: "Database error", error: err2.message });
      }

      console.log(`✅ Status for user ID ${id} successfully updated to "${status}"`);

      // Prepare email content
      let subject, htmlContent;

      if (status === "Approved") {
        subject = "🎉 Your Account Has Been Approved!";
        htmlContent = `
          <h2>Hello ${first_name || "User"},</h2>
          <p>We’re happy to inform you that your account has been <b>approved</b>.</p>
          <p>You can now log in and enjoy full access.</p>
          <p>Thank you for registering with us!</p>
        `;
      } else if (status === "Rejected") {
        subject = "⚠️ Your Account Has Been Rejected";
        htmlContent = `
          <h2>Hello ${first_name || "User"},</h2>
          <p>We regret to inform you that your account registration has been <b>rejected</b>.</p>
          <p>Please contact your Barangay office for more information or to reapply.</p>
        `;
      } else {
        subject = "🕓 Your Account is Pending Review";
        htmlContent = `
          <h2>Hello ${first_name || "User"},</h2>
          <p>Your account is currently <b>Pending</b>.</p>
          <p>Please wait for our team to review your submission. We’ll notify you once it’s processed.</p>
        `;
      }

      console.log(`📧 Preparing to send ${status} email to: ${email}`);

      // Send email via Gmail
      try {
        const info = await transporter.sendMail({
          from: `"Barangay E-Clearance" <yourgmail@gmail.com>`,
          to: email,
          subject,
          html: htmlContent,
        });

        console.log("✅ Gmail message sent successfully!");
        console.log("📨 Message ID:", info.messageId);
        console.log("📬 Response:", info.response);

        res.json({ message: `Status updated to ${status} and email sent to ${email}` });
      } catch (mailErr) {
        console.error("❌ Failed to send Gmail message:", mailErr);
        res.status(500).json({ message: "Status updated but failed to send email." });
      }
    });
  });
};
export const removeUser = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    res.json({ message: "User removed successfully" });
  });
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  // Step 1: Check if email exists
  const query = "SELECT id, first_name, last_name FROM users WHERE email = ?";
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err.message });
    if (results.length === 0) return res.status(404).json({ message: "Email not found" });

    const { id, first_name, last_name } = results[0];

    // Step 2: Generate reset token
    const token = crypto.randomBytes(20).toString("hex");
    const expire = Date.now() + 3600000; // 1 hour

    // Save token to DB
    const updateQuery = "UPDATE users SET reset_token = ?, reset_token_exp = ? WHERE id = ?";
    db.query(updateQuery, [token, expire, id], async (err2) => {
      if (err2) return res.status(500).json({ message: "Failed to save token" });

      // Step 3: Send email
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "brgybangbang2025@gmail.com",
          pass: "kjmk xavo lews zzsz", // use App Password
        },
      });

      const resetLink = `http://localhost:5173/reset-password/${token}`; // frontend reset page

      const mailOptions = {
        from: '"Barangay eClearance" <brgybangbang2025@gmail.com>',
        to: email,
        subject: "Reset Your Password",
        html: `
          <h2>Barangay eClearance Password Reset</h2>
          <p>Hi <b>${first_name} ${last_name}</b>,</p>
          <p>You requested a password reset. Click the link below to reset your password (expires in 1 hour):</p>
          <a href="${resetLink}" target="_blank">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Reset email sent successfully" });
      } catch (emailErr) {
        console.error("Email error:", emailErr);
        res.status(500).json({ message: "Failed to send email" });
      }
    });
  });
};

export const resetPassword = (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) return res.status(400).json({ message: "Password is required" });

  // Step 1: Find user by token and check expiration
  const query = "SELECT id, reset_token_exp FROM users WHERE reset_token = ?";
  db.query(query, [token], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "Invalid token" });

    const user = results[0];
    if (Date.now() > user.reset_token_exp) {
      return res.status(400).json({ message: "Token expired" });
    }

    // Step 2: Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Update password and clear token fields
    const updateQuery = "UPDATE users SET password = ?, reset_token = NULL, reset_token_exp = NULL WHERE id = ?";
    db.query(updateQuery, [hashedPassword, user.id], (err2) => {
      if (err2) return res.status(500).json({ message: "Failed to update password" });

      res.status(200).json({ message: "Password has been reset successfully" });
    });
  });
};