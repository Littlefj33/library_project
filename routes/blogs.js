import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("blogs", { title: "Blogs" });
});

router.route("/info").get(async (req, res) => {
  return res.render("bookInfo", { title: "Blogs" });
});

router.route("/comments/:blogId").get(async (req, res) => {
  return res.render("blogComments", { title: "Blogs" });
});

router.route("/comments/:blogId/create").get(async (req, res) => {
  return res.render("createComment", { title: "Blogs" });
});

export default router;
