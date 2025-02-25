import { Router } from "express";
import { signupPost } from "../controllers/authControllers.js";
import passport from "passport";

const signUpRouter = Router();
const loginRouter = Router();
const logoutRouter = Router();

signUpRouter.get("/sign-up", (req, res) => res.render("sign-up"));
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

export { signUpRouter, loginRouter, logoutRouter };
