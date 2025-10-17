import * as Clearance from "../models/clearanceModel.js";
import nodemailer from "nodemailer";
import db from "../config/db.js";
import { getIO } from "../config/socket.js"; // import getIO

// Get all clearances (admin)
export const getAllClearances = (req, res) => {
  Clearance.getAllClearances((err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(200).json({ data: results });
  });
};


// Get user clearances
export const getUserClearances = (req, res) => {
  const userId = req.user.id;
  Clearance.getClearancesByUser(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
};

// Get clearances by type
export const getClearancesByType = (req, res) => {
  const { type } = req.params;
  Clearance.getClearancesByType(type, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
};


export const requestClearance = (req, res) => {
  const { role, id: userId } = req.user;
  const { type, full_name, purpose, gender, purok, business_name, business_owner, business_nature, pickup_date } = req.body;

  const validTypes = ["Sanitary", "Barangay", "Business"];
  if (!validTypes.includes(type)) {
    return res.status(400).json({ message: "Invalid clearance type" });
  }

  const clearanceData = {
    user_id: role === "Admin" ? null : userId,
    type,
    full_name,
    gender,
    purok,
    purpose,
    business_name,
    business_owner,
    business_nature,
    pickup_date
  };

  Clearance.addClearance(clearanceData, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error", error: err });
    }

    // Emit using global IO instance
    try {
      const io = getIO();
      io.emit("newClearance", {
        message: `📄 New clearance request from ${full_name}`,
      });
      console.log("✅ Emitted socket event: newClearance");
    } catch (socketErr) {
      console.error("Socket.IO not initialized:", socketErr.message);
    }

    res.status(201).json({
      message: "Clearance request added successfully",
      clearanceId: result.insertId,
    });
  });
};
export const updateClearanceStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) return res.status(400).json({ message: "Status is required" });

  // Step 1: Update the clearance status in DB
  Clearance.updateStatus(id, status, async (err) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.message });
    }

    console.log(`✅ Clearance ID ${id} updated to status: ${status}`);

    // Step 2: Fetch user info
    const query = `
      SELECT u.email, u.first_name, u.last_name
      FROM clearances c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `;

    db.query(query, [id], async (err, results) => {
      if (err) {
        console.error("❌ Failed to fetch user info:", err);
        return res.status(500).json({ message: "Failed to fetch user info" });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const { email, first_name, last_name } = results[0];

      // Step 3: Send email (optional)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "brgybangbang2025@gmail.com",
          pass: "kjmk xavo lews zzsz",
        },
      });

      const mailOptions = {
        from: '"Barangay eClearance" <yourgmail@gmail.com>',
        to: email,
        subject: `Your Clearance Request Status: ${status}`,
        html: `
          <h2>Barangay eClearance Update</h2>
          <p>Dear <b>${first_name} ${last_name}</b>,</p>
          <p>Your clearance request (ID: <b>${id}</b>) has been updated to: 
          <b style="color:${status === "Approved" ? "green" : status === "Rejected" ? "red" : "orange"}">
            ${status}
          </b></p>
          <p>Thank you for using our system.</p>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("📨 Email sent successfully");
      } catch (emailErr) {
        console.error("❌ Failed to send email:", emailErr);
      }

      // Step 4: Emit Socket.IO notification
      try {
        const io = getIO();
        io.emit("clearanceNotification", {
          message: `Your clearance request (ID: ${id}) is now ${status}`,
        });
      } catch (ioErr) {
        console.error("❌ Socket.IO emit error:", ioErr);
      }

      // Step 5: Send response
      res.status(200).json({
        message: "Status updated and notification sent",
        emailSent: true,
      });
    });
  });
};
// Delete clearance
export const deleteClearance = (req, res) => {
  const { id } = req.params;
  Clearance.deleteClearance(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (result.affectedRows === 0) return res.status(404).json({ message: "Clearance not found" });
    res.json({ message: "Clearance deleted successfully" });
  });
};

