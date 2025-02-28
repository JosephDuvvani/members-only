import { getAllPosts } from "../db/queries.js";
import { format } from "date-fns";

const homepage = async (req, res, next) => {
  if (req.user) {
    const messages = await getAllPosts();
    if (messages.length == 0) {
      res.render("index");
      return;
    }
    const posts = messages.map((msg) => {
      const author = `${msg.firstname} ${msg.lastname}`.trim();
      const post = {
        ...msg,
        timestamp: format(msg.timestamp, "MMM d, yyyy 'at' HH:mm"),
        author,
      };
      return post;
    });
    res.render("index", { posts });
  } else {
    res.render("index", {
      error: req.session.messages ? req.session.messages[0] : null,
    });
  }
};

export { homepage };
