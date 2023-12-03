import homeRoutes from "./home.js";
import bookRoutes from "./books.js";
import eventRoutes from "./events.js";
import blogRoutes from "./blogs.js";
import profileRoutes from "./profile.js";

const constructorMethod = (app) => {
  app.use("/", homeRoutes);
  app.use("/books", bookRoutes);
  app.use("/events", eventRoutes);
  app.use("/blogs", blogRoutes);
  app.use("/profile", profileRoutes);

  app.use("*", (req, res) => {
    return res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
