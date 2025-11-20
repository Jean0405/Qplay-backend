import * as UserModel from "../models/user.js";

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRanking = async (req, res) => {
  const { examCategoryId } = req.params;
  try {
    const ranks = await UserModel.getRanking(examCategoryId);
    res.json(ranks);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
