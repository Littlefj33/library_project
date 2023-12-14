import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/:bookId").get(async (req, res) => {
  return res.render("bookInfo", { title: "Books" });
});

router.route("/:bookId/review").get(async (req, res) => {
  return res.render("bookReviews", { title: "Books" });
});

router.route("/:bookId/request").get(async (req, res) => {
  return res.render("requestBook", { title: "Books" });
});

export default router;
