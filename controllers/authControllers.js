import { body, validationResult } from "express-validator";
import {
  addNewPost,
  changeToAdmin,
  changeToMember,
  getUserByUsername,
} from "../db/queries.js";
import { addUser } from "../db/queries.js";
import passport from "passport";
import { configDotenv } from "dotenv";

configDotenv();

const alphaErr = "must only contain letters.";
const emptyTextErr = "must contain 1 or more characters";

const validateUser = [
  body("firstname")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Firstname ${emptyTextErr}`)
    .isAlpha()
    .withMessage(`Firstname ${alphaErr}`),
  body("lastname")
    .trim()
    .optional({ checkFalsy: true })
    .notEmpty()
    .isAlpha()
    .withMessage(`Lastname ${alphaErr}`),
  body("username")
    .trim()
    .isLength({ min: 1 })
    .withMessage(`Username ${emptyTextErr}`)
    .isAlpha()
    .withMessage(`Username ${alphaErr}`)
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
      res.status(400).render("sign-up", { error: errors[0], values: req.body });
      return;
    }
    await addUser(req.body);
    if (req.body.isAdmin) {
      const username = req.body.username;
      passport.authenticate("local")(req, res, () => {
        res.redirect(`/adminCode/${username}`);
      });
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      });
    }
  },
];

const adminCodePost = async (req, res, next) => {
  const isAdmin = req.body.adminCode === process.env.ADMIN_CODE;
  if (isAdmin) {
    await changeToAdmin(req.params.username);
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const memberCodePost = async (req, res, next) => {
  const isMember = req.body.passcode === process.env.MEMBER_PASSCODE;
  if (isMember) {
    await changeToMember(req.user.id);
    res.redirect("/");
  } else {
    res.redirect("/");
  }
};

const createMsgPost = async (req, res, next) => {
  const { title, message } = req.body;
  const { id } = req.user;
  await addNewPost({ title, message, id });
  res.redirect("/");
};

export { signupPost, adminCodePost, memberCodePost, createMsgPost };
