import * as QuestionModel from "../models/question.js";

export const getPendingQuestions = async (req, res) => {
  try {
    const pending = await QuestionModel.getPending();
    res.json(pending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateQuestionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ message: "Invalid status" });
  try {
    const q = await QuestionModel.findById(id);
    if (!q) return res.status(404).json({ message: "Question not found" });
    await QuestionModel.updateStatus(id, status);
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
