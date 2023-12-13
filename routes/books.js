import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/info").get(async (req, res) => {
  return res.render("bookInfo", { title: "Books" });
});

router.route("/reviews/:bookId").get(async (req, res) => {
  return res.render("bookReviews", { title: "Books" });
});

router.route("/reviews/:bookId/create").get(async (req, res) => {
  return res.render("createReview", { title: "Books" });
});

export default router;
