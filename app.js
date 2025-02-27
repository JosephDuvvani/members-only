import express from "express";
import path from "path";
import {
  signUpRouter,
  loginRouter,
  logoutRouter,
  adminRouter,
  memberRouter,
} from "./routes/authRouter.js";
import passport from "passport";
import { sessionStore, localStrategy } from "./db/pgSession.js";
import { pool } from "./db/pool.js";
import { postRouter } from "./routes/postRouter.js";
import { homepage } from "./controllers/postControllers.js";

const app = express();

app.set("views", "views");
app.set("view engine", "ejs");

app.use(sessionStore);
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.resolve();
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

passport.use(localStrategy);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.get("/", homepage);
app.use(
  "/",
  signUpRouter,
  loginRouter,
  logoutRouter,
  adminRouter,
  postRouter,
  memberRouter
);

app.listen(3000);
