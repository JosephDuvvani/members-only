import { Router } from "express";
import { createMsgPost } from "../controllers/authControllers.js";
import { deletePost } from "../controllers/postControllers.js";

const postRouter = Router();

postRouter.get("/createPost", (req, res) => {
  if (!req.user) {
    res.end("<h1>Unauthorized url</h1>");
    return;
  }
  res.render("create-post");
});

postRouter.post("/createPost", createMsgPost);
postRouter.post("/delete/:id", deletePost);

export { postRouter };
