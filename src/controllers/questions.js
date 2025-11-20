import * as QuestionModel from "../models/question.js";

export const getQuestionsByCategoryAndSubject = async (req, res) => {
  const { examCategoryId, subjectId } = req.params;
  try {
    const questions = await QuestionModel.getApprovedByCategoryAndSubject(
      examCategoryId,
      subjectId
    );
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const recommendQuestion = async (req, res) => {
  try {
    const {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      idExamCategory,
      idSubject,
    } = req.body;
    if (
      !questionText ||
      !optionA ||
      !optionB ||
      !optionC ||
      !optionD ||
      !correctOption ||
      !idExamCategory ||
      !idSubject
    ) {
      return res.status(400).json({ message: "Missing fields" });
    }
    const q = await QuestionModel.insert({
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctOption,
      status: "pending",
      idUser: req.user.id,
      idExamCategory,
      idSubject,
    });
    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
