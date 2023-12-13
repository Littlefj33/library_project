import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/comments/:bookId").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/comments/:bookId/create").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

export default router;
