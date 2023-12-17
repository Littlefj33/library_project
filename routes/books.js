import { dbTool } from "../data/dbTools.js";
import { books } from "../config/mongoCollections.js";
import { Router } from "express";
import { addReview, requestBook } from "../data/books.js";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("books", { title: "Books" });
});

router.route("/:bookId").get(async (req, res) => {
  const bookId = req.params.bookId.trim();
  const bookCollection = await books();
  const data = await dbTool(bookCollection, "_id", bookId, {
    _id: 1,
    title: 1,
  });
  return res.render("bookInfo", { title: "Book Info", data });
});

router.route("/:bookId/review").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    const { content, rating } = req.body;
    const bookId = req.params.bookId.trim();
    try {
      const results = await addReview(
        bookId,
        user.emailAddress,
        content,
        rating
      );
      if (results.insertedBook === true) {
        return res.redirect(`/books/${bookId}`);
      } else {
        return res.status(500).render("error", {
          title: "ERROR Page",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "ERROR Page",
        error: e,
      });
    }
  }
});

router.route("/:bookId/request").get(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    try {
      const bookId = req.params.bookId.trim();
      const results = await requestBook(bookId, user.emailAddress);
      if (results.insertedBook === true) {
        return res.redirect(`/books/${bookId}`);
      } else {
        return res.status(500).render("error", {
          title: "ERROR Page",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "ERROR Page",
        error: e,
      });
    }
  }
});

export default router;
