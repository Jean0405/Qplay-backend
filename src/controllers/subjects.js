import * as SubjectModel from "../models/subject.js";

export const getSubjects = async (req, res) => {
  try {
    const subjects = await SubjectModel.getAll();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSubject = async (req, res) => {
  const { name } = req.body;
  try {
    const s = await SubjectModel.create({ name });
    res.json(s);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
