import db from '../config/db.js';

export const getAllResidents = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM residents ORDER BY id DESC", (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const getResidentById = (id) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT * FROM residents WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

export const addResident = (resident) => {
  const { fullname, age, gender, status, purok } = resident;
  return new Promise((resolve, reject) => {
    db.query(
      "INSERT INTO residents (fullname, age, gender, status, purok) VALUES (?, ?, ?, ?, ?)",
      [fullname, age, gender, status, purok],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

export const updateResident = (id, resident) => {
  const { fullname, age, gender, status, purok } = resident;
  return new Promise((resolve, reject) => {
    db.query(
      "UPDATE residents SET fullname = ?, age = ?, gender = ?, status = ?, purok = ? WHERE id = ?",
      [fullname, age, gender, status, purok, id],
      (err, results) => {
        if (err) return reject(err);
        resolve(results);
      }
    );
  });
};

export const deleteResident = (id) => {
  return new Promise((resolve, reject) => {
    db.query("DELETE FROM residents WHERE id = ?", [id], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
