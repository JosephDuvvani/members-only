import { Router } from "express";
import { signupPost } from "../controllers/authControllers.js";

const signUpRouter = Router();

signUpRouter.get("/sign-up", (req, res) => res.render("sign-up"));
signUpRouter.post("/sign-up", signupPost);

export { signUpRouter };
