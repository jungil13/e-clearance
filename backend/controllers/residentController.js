import * as Resident from '../models/residentModel.js';

export const getResidents = async (req, res) => {
  try {
    const residents = await Resident.getAllResidents();
    res.json(residents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getResident = async (req, res) => {
  try {
    const resident = await Resident.getResidentById(req.params.id);
    if (!resident) return res.status(404).json({ message: "Resident not found" });
    res.json(resident);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createResident = async (req, res) => {
  try {
    const result = await Resident.addResident(req.body);
    res.status(201).json({ message: "Resident added", id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editResident = async (req, res) => {
  try {
    const result = await Resident.updateResident(req.params.id, req.body);
    res.json({ message: "Resident updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const removeResident = async (req, res) => {
  try {
    const result = await Resident.deleteResident(req.params.id);
    res.json({ message: "Resident deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

