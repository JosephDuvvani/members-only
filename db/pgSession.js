import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import { Strategy } from "passport-local";
import { pool } from "./pool.js";

const pgSession = connectPgSimple(session);
const LocalStrategy = Strategy;

const sessionStore = session({
  store: new pgSession({ pool: pool }),
  secret: "something",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
});

const localStrategy = new LocalStrategy(async (username, password, done) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    const user = rows[0];

    if (!user) {
      return done(null, false, { message: "Incorrect username" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return done(null, false, { message: "Incorrect password" });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

export { sessionStore, localStrategy };
