import * as Officials from "../models/officialsModel.js";

export const getOfficials = async (req, res) => {
  try {
    const search = req.query.search || "";
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const data = await Officials.getAllOfficials(search, limit, offset);
    const total = await Officials.countOfficials(search);

    res.json({ data, total, page, limit });
  } catch (err) {
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

export const addOfficial = async (req, res) => {
  try {
    const id = await Officials.createOfficial(req.body);
    res.status(201).json({ message: "Official added", id });
  } catch (err) {
    res.status(500).json({ message: "Failed to add official", error: err.message });
  }
};

export const updateOfficialById = async (req, res) => {
  try {
    const { id } = req.params;
    await Officials.updateOfficial(id, req.body);
    res.json({ message: "Official updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update official", error: err.message });
  }
};

export const deleteOfficialById = async (req, res) => {
  try {
    const { id } = req.params;
    await Officials.deleteOfficial(id);
    res.json({ message: "Official deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete official", error: err.message });
  }
};
