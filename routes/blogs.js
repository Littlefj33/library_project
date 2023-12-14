import { dbTool } from "../data/dbTools.js";
import { blogs } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("blogs", { title: "Blogs" });
});

router.route("/:blogId").get(async (req, res) => {
  const blogId = req.params.blogId.trim();
  const blogCollection = await blogs();
  const data = await dbTool(blogCollection, "_id", blogId, {
    _id: 1,
    title: 1,
  });
  return res.render("blogDetails", { title: "Blog Info", data });
});

/* Maybe remove?? */
router.route("/:blogId/comment").get(async (req, res) => {
  return res.render("blogComments", { title: "Blogs" });
});

router.route("/create").get(async (req, res) => {
  return res.render("createBlog", { title: "Blogs" });
});

export default router;
