import { body, validationResult } from "express-validator";

/**
 * Runs after the validation rules below and turns any failures
 * into a clean 400 response instead of letting bad data through.
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg, // show the first error — simplest for a student-facing UI
    });
  }
  next();
};

// ===== Signup validation =====
export const signupValidation = [
  body("name").trim().notEmpty().withMessage("Name is required").isLength({ max: 50 }),
  body("email").trim().isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ===== Login validation =====
export const loginValidation = [
  body("email").trim().isEmail().withMessage("Please enter a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ===== Quiz generation validation =====
// This doubles as prompt-injection protection: we cap length (so nobody pastes
// a giant payload trying to override instructions) and require SOME content.
export const quizGenerationValidation = [
  body("topic")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 200 })
    .withMessage("Topic must be under 200 characters"),
  body("studyText")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20000 })
    .withMessage("Pasted text is too long (max ~20,000 characters)"),
  body().custom((value, { req }) => {
    if (!req.body.topic && !req.body.studyText) {
      throw new Error("Please provide a topic or paste some study material");
    }
    return true;
  }),
];
