import homeRoutes from "./home.js";
import bookRoutes from "./books.js";
import eventRoutes from "./events.js";
import blogRoutes from "./blogs.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/books", bookRoutes);
  app.use("/events", eventRoutes);
  app.use("/blogs", blogRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
