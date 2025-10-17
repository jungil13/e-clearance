import db from "../config/db.js";

export const getAllClearances = (callback) => {
  const sql = `
    SELECT 
      c.id,
      c.user_id,
      c.type,
      COALESCE(c.full_name, CONCAT(u.first_name, ' ', u.last_name)) AS fullname,
      u.gender,
      u.purok,
      c.purpose,
      c.business_name,
      c.business_owner,
      c.business_nature,
      c.pickup_date,
      c.requested_at,
      c.status
    FROM clearances c
    JOIN users u ON c.user_id = u.id
    ORDER BY c.requested_at DESC
  `;
  db.query(sql, callback);
};
export const getClearancesByUser = (userId, callback) => {
  const sql = "SELECT * FROM clearances WHERE user_id = ? ORDER BY requested_at DESC";
  db.query(sql, [userId], callback);
};

// ✅ Get clearances by type (handles barangay, business, etc.)
export const getClearancesByType = (type, callback) => {
  const sql = `
    SELECT 
      c.id,
      c.user_id,
      c.type,
      COALESCE(c.full_name, CONCAT(u.first_name, ' ', u.last_name)) AS fullname,
      COALESCE(c.gender, u.gender, 'Unknown') AS gender,
      COALESCE(c.purok, u.purok, 'N/A') AS purok,
      c.purpose,
      c.business_name,
      c.business_owner,
      c.business_nature,
      c.pickup_date,
      c.requested_at,
      c.status
    FROM clearances c
    LEFT JOIN users u ON c.user_id = u.id
    WHERE c.type = ?
    ORDER BY c.requested_at DESC
  `;
  db.query(sql, [type], callback);
};

export const getClearanceById = (id, callback) => {
  const sql = "SELECT * FROM clearances WHERE id = ?";
  db.query(sql, [id], callback);
};

export const addClearance = (data, callback) => {
  const sql = `
    INSERT INTO clearances
      (user_id, type, full_name, gender, purok, purpose, business_name, business_owner, business_nature, pickup_date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    data.user_id || null,
    data.type,
    data.full_name || null,
    data.gender || null,
    data.purok || null,
    data.purpose || null,
    data.business_name || null,
    data.business_owner || null,
    data.business_nature || null,
    data.pickup_date || null,
  ];

  db.query(sql, params, callback);
};

export const updateStatus = (id, status, callback) => {
  const sql = `UPDATE clearances SET status = ? WHERE id = ?`;
  db.query(sql, [status, id], callback);
};

export const deleteClearance = (id, callback) => {
  const sql = "DELETE FROM clearances WHERE id = ?";
  db.query(sql, [id], callback);
};
