import express from "express";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import configRoutes from "./routes/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = express.static(__dirname + "/public");

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "main", partialsDir: ["views/partials/"] })
);
app.set("view engine", "handlebars");
app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.use(cookieParser());
app.use(
  session({
    name: "AuthState",
    secret: "A secret string that only we know!",
    resave: false,
    saveUninitialized: false,
  })
);

/* Used for testing - Can delete at later time */
app.use("/", async (req, res, next) => {
  // 1a
  const curTime = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  const user = req.session.user;

  let auth = "";
  if (!user) {
    auth = "(Non-Authenticated User)";
  } else if (user.role === "admin" || user.role === "user") {
    auth = "(Authenticated User)";
  } else {
    auth = "(Non-Authenticated User)";
  }
  console.log(`${curTime}: ${method} ${route} ${auth}`);
  next();
});

app.get("/login", async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    return res.redirect("/home");
  } else {
    next();
  }
});

app.get("/register", async (req, res, next) => {
  const user = req.session.user;
  if (user) {
    return res.redirect("/home");
  } else {
    next();
  }
});

app.get("/books/request", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/books/reviews/create", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/events/create", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/events/comments/create", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/blogs/create", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/blogs/comments/create", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

app.get("/logout", async (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    next();
  }
});

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
