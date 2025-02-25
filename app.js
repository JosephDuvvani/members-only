import express from "express";
import { signUpRouter } from "./routes/authRouter.js";

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.render("index"));
app.use("/", signUpRouter);

app.listen(3000);
