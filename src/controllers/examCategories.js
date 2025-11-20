import * as ExamCategoryModel from "../models/examCategory.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await ExamCategoryModel.getAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createExamCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const cat = await ExamCategoryModel.create({ name, description });
    res.json(cat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
