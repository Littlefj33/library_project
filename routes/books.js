import { dbTool } from "../data/dbTools.js";
import { books } from "../config/mongoCollections.js";
import { Router } from "express";
import { addReview, requestBook } from "../data/books.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    const booksCollection = await books();
    let booksList = await booksCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            title: 1,
            authors: 1,
            publication_date: 1,
            summary: 1,
            language: 1,
            genres: 1,
            page_count: 1,
            isbn: 1,
            condition_status: 1,
            liability_cost: 1,
            total_stock: 1,
            current_stock: 1,
            current_borrowers: 1,
            reviews: 1,
            comments: 1,
          },
        }
      )
      .toArray();
    if (!booksList) throw "ERROR: Could not get all books";
    return res.render("books", { title: "Books", data: booksList, partial: 'searchBook' });
  } catch (e) {
    return res.status(500).render("error", {
      title: "ERROR Page",
      error: "Internal Server Error",
    });
  }
});

router.route("/:bookId").get(async (req, res) => {
  const bookId = req.params.bookId.trim();
  const bookCollection = await books();
  let data;
  try {
    let bookData = await dbTool(bookCollection, "_id", bookId, {
      _id: 1,
      title: 1,
      authors: 1,
      publication_date: 1,
      summary: 1,
      language: 1,
      genres: 1,
      page_count: 1,
      isbn: 1,
      condition_status: 1,
      liability_cost: 1,
      total_stock: 1,
      current_stock: 1,
      current_borrowers: 1,
      reviews: 1,
      comments: 1,
    });
    data = bookData[0];
  } catch (e) {
    return res.status(404).render("error", {
      title: "ERROR Page",
      error: "Page not found",
    });
  }
  return res.render("bookDetails", { title: "Book Info", data });
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
