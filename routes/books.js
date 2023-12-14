import { dbTool } from "../data/dbTools.js";
import { books } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/:bookId").get(async (req, res) => {
  const bookId = req.params.bookId.trim();
  const eventCollection = await books();
  const data = await dbTool(eventCollection, "_id", bookId, {
    _id: 1,
    title: 1,
  });
  return res.render("bookInfo", { title: "Book Info", data });
});

/* Maybe remove?? */
router.route("/:bookId/review").get(async (req, res) => {
  return res.render("bookReviews", { title: "Books" });
});

/* Maybe remove?? */
router.route("/:bookId/request").get(async (req, res) => {
  return res.render("requestBook", { title: "Books" });
});

export default router;
