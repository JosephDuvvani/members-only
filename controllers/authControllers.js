import { body, validationResult } from "express-validator";
import { getUserByUsername } from "../db/queries.js";
import { addUser } from "../db/queries.js";

const alphaErr = "must only contain letters.";
const emptyTextErr = "must contain 1 or more characters";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstname")
    .trim()
    .isAlpha()
    .withMessage(`Firstname ${alphaErr}`)
    .isLength({ min: 1 })
    .withMessage(`Firstname ${emptyTextErr}`),
  body("lastname").trim().isAlpha().withMessage(`Lastname ${alphaErr}`),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Username ${emptyTextErr}`)
    .custom(async (value) => {
      const existingUser = await getUserByUsername(value);
      if (existingUser) {
        throw new Error(`Username (${value}) is already taken`);
      }
    }),
  body("password")
    .isLength({ min: 8, max: 50 })
    .withMessage("Password must be 8 or more characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password confirmation does not match password");
    } else {
      return true;
    }
  }),
];

const signupPost = [
  validateUser,
  async (req, res) => {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      res.status(400).render("sign-up", { errors });
      return;
    }
    await addUser(req.body);
  },
];

export { signupPost };
