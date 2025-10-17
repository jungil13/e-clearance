import db from "../config/db.js";

const User = {
 create: (data) => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users 
      (first_name, middle_name, last_name, age, gender, email, valid_id, username, password, purok, civil_status, address, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    db.query(
      sql,
      [
        data.first_name,
        data.middle_name,
        data.last_name,
        data.age,
        data.gender,
        data.email,
        data.valid_id,
        data.username,
        data.password,
        data.purok,
        data.civil_status,
        data.address
      ],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
},

  findByUsername: (username) => {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM users WHERE username = ?";
      db.query(sql, [username], (err, result) => {
        if (err) reject(err);
        else resolve(result[0]);
      });
    });
  },
};

export default User;
