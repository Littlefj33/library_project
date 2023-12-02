import express from "express";
import path from "path";
import { engine as handlebars } from "express-handlebars";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const constructorMethod = (app) => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Register the public folder
    app.use("/public", express.static(__dirname + "/../public"));

    // Set up the express-handlebars view engine
    app.engine("handlebars", handlebars({ defaultLayout: "main" }));
    app.set("view engine", "handlebars");
    app.set("views", path.join(__dirname, "../views"));
}

export default constructorMethod