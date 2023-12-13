import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("blogs", { title: "Blogs" });
});

router.route("/:blogId").get(async (req, res) => {
  return res.render("blogInfo", { title: "Blogs" });
});

router.route("/:blogId/comment").get(async (req, res) => {
  return res.render("blogComments", { title: "Blogs" });
});

router.route("/create").get(async (req, res) => {
  return res.render("createBlog", { title: "Blogs" });
});

export default router;
