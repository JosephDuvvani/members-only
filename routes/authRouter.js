import { Router } from "express";
import { adminCodePost, signupPost } from "../controllers/authControllers.js";
import passport from "passport";

const signUpRouter = Router();
const loginRouter = Router();
const logoutRouter = Router();
const adminRouter = Router();

signUpRouter.get("/sign-up", (req, res) => {
  if (req.user) {
    res.end("<h1>Unauthorized url</h1>");
    return;
  }
  res.render("sign-up");
});
signUpRouter.post("/sign-up", signupPost);

loginRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })
);

logoutRouter.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

adminRouter.get("/adminCode/:username", (req, res, next) => {
  if (req.user.username === req.params.username) {
    res.render("admin-code");
  } else {
    res.end("<h1>Invalid url</h1>");
  }
});

adminRouter.post("/adminCode/:username", adminCodePost);

export { signUpRouter, loginRouter, logoutRouter, adminRouter };
