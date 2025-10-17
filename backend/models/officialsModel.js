import db from "../config/db.js";

export const getAllOfficials = (search, limit, offset) => {
  const q = `%${search}%`;
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT * FROM officials 
       WHERE fullname LIKE ? OR position LIKE ? OR chairmanship LIKE ? 
       ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [q, q, q, limit, offset],
      (err, results) => (err ? reject(err) : resolve(results))
    );
  });
};

export const countOfficials = (search) => {
  const q = `%${search}%`;
  return new Promise((resolve, reject) => {
    db.query(
      `SELECT COUNT(*) AS total FROM officials 
       WHERE fullname LIKE ? OR position LIKE ? OR chairmanship LIKE ?`,
      [q, q, q],
      (err, results) => (err ? reject(err) : resolve(results[0].total))
    );
  });
};

export const createOfficial = (data) => {
  const { fullname, chairmanship, position, status } = data;
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO officials (fullname, chairmanship, position, status) VALUES (?, ?, ?, ?)`,
      [fullname, chairmanship, position, status],
      (err, result) => (err ? reject(err) : resolve(result.insertId))
    );
  });
};

export const updateOfficial = (id, data) => {
  const { fullname, chairmanship, position, status } = data;
  return new Promise((resolve, reject) => {
    db.query(
      `UPDATE officials SET fullname=?, chairmanship=?, position=?, status=? WHERE id=?`,
      [fullname, chairmanship, position, status, id],
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
};

export const deleteOfficial = (id) => {
  return new Promise((resolve, reject) => {
    db.query(
      `DELETE FROM officials WHERE id=?`,
      [id],
      (err, result) => (err ? reject(err) : resolve(result))
    );
  });
};
