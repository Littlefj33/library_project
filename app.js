import express from "express";
import exphbs from "express-handlebars";
import cookieParser from "cookie-parser";
import session from "express-session";
import { fileURLToPath } from "url";
import { dirname } from "path";
import configRoutes from "./routes/index.js";
import { getUser } from "./helpers.js"
import Handlebars from "handlebars"

const app = express();

Handlebars.registerHelper("getAuthor", getUser)
Handlebars.registerHelper("getOrganizer", getUser)


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

app.use("/public", staticDir);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);
app.use(cookieParser());
app.use(
  session({
    name: "AuthState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  }),
);

app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "main", partialsDir: ["views/partials/"] }),
);
app.set("view engine", "handlebars");

configRoutes(app);
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
