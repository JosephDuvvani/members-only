import { Router } from "express";
import { createMsgPost } from "../controllers/authControllers.js";

const postRouter = Router();

postRouter.get("/createPost", (req, res) => {
  if (!req.user) {
    res.end("<h1>Unauthorized url</h1>");
    return;
  }
  res.render("create-post");
});

postRouter.post("/createPost", createMsgPost);

export { postRouter };
