import { dbTool } from "../data/dbTools.js";
import { books, users } from "../config/mongoCollections.js";
import { Router } from "express";
import xss from "xss";
import {
  addReview,
  requestBook,
  approveRequest,
  returnBook,
  favoriteBook,
} from "../data/books.js";
const router = Router();

router.route("/").get(async (req, res) => {
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

    const user = req.session.user;
    const userCollection = await users();
    let bookIndex = 0;
    for (const book of booksList) {
      if (user) {
        let userInfo = await dbTool(
          userCollection,
          "emailAddress",
          user.emailAddress,
          { _id: 1, favorite_books: 1 }
        );
        let user_requested = false;
        let user_reviewed = false;
        let user_favorited = false;
        for (let borrower of book["current_borrowers"]) {
          if (borrower.toString() === userInfo[0]["_id"].toString()) {
            user_requested = true;
          }
        }
        for (let review of book["reviews"]) {
          if (review["authorId"].toString() === userInfo[0]["_id"].toString()) {
            user_reviewed = true;
          }
        }

        for (let favoriteBook of userInfo[0]["favorite_books"]) {
          if (favoriteBook.toString() === book["_id"].toString()) {
            user_favorited = true;
          }
        }

        if (user_requested) {
          booksList[bookIndex]["user_requested"] = true;
        } else {
          booksList[bookIndex]["user_requested"] = false;
        }

        if (user_reviewed) {
          booksList[bookIndex]["user_reviewed"] = true;
        } else {
          booksList[bookIndex]["user_reviewed"] = false;
        }

        if (user_favorited) {
          booksList[bookIndex]["user_favorited"] = true;
        } else {
          booksList[bookIndex]["user_favorited"] = false;
        }
      } else {
        booksList[bookIndex]["user_requested"] = false;
        booksList[bookIndex]["user_reviewed"] = false;
        booksList[bookIndex]["user_favorited"] = false;
      }
      bookIndex++;
    }

    return res.render("books", { title: "Books", data: booksList });
  } catch (e) {
    return res.status(500).render("error", {
      title: "ERROR Page",
      error: "Internal Server Error",
    });
  }
});

router.route("/updateBook").post(async (req, res) => {
  if (!req.session.user || req.session.user.role !== "admin") {
    return res.status(403).render("error", {
      title: "ERROR Page",
      error: "Forbidden",
    });
  }
  let { isbn, stock, quality } = req.body;
  isbn = xss(isbn);
  stock = xss(stock);
  quality = xss(quality);
  if (!isbn || isNaN(stock) || !["good", "fair", "bad"].includes(quality)) {
    return res.status(400).render("error", {
      title: "ERROR Page",
      error: "Invalid input",
    });
  }
  try {
    const bookCollection = await books();
    const updateInfo = await bookCollection.updateOne(
      { isbn: isbn },
      { $set: { current_stock: parseInt(stock), condition_status: quality } }
    );

    if (updateInfo.modifiedCount === 0) {
      throw new Error("Book update failed or no changes made.");
    }

    // Redirect or send a response upon successful update
    res.redirect("/admin"); // Redirect to a confirmation page or back to the form
  } catch (error) {
    res.status(500).render("error", {
      title: "ERROR Page",
      error: error.message || "Internal Server Error",
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
    const user = req.session.user;
    const userCollection = await users();
    if (user) {
      let userInfo = await dbTool(
        userCollection,
        "emailAddress",
        user.emailAddress,
        { _id: 1, favorite_books: 1 }
      );
      let user_requested = false;
      let user_reviewed = false;
      let user_favorited = false;
      for (let borrower of data["current_borrowers"]) {
        if (borrower.toString() === userInfo[0]["_id"].toString()) {
          user_requested = true;
        }
      }
      for (let review of data["reviews"]) {
        if (review["authorId"].toString() === userInfo[0]["_id"].toString()) {
          user_reviewed = true;
        }
      }

      for (let favoriteBook of userInfo[0]["favorite_books"]) {
        if (favoriteBook.toString() === bookId) {
          user_favorited = true;
        }
      }
      if (user_requested) {
        data["user_requested"] = true;
      } else {
        data["user_requested"] = false;
      }
      if (user_reviewed) {
        data["user_reviewed"] = false;
      } else {
        data["user_reviewed"] = false;
      }
      if (user_favorited) {
        data["user_favorited"] = true;
      } else {
        data["user_favorited"] = false;
      }
    } else {
      data["user_requested"] = false;
      data["user_reviewed"] = false;
      data["user_favorited"] = false;
    }

    return res.render("bookDetails", { title: "Book Info", data });
  } catch (e) {
    return res.status(404).render("error", {
      title: "ERROR Page",
      error: "Page not found",
    });
  }
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

router.route("/:bookId/request").post(async (req, res) => {
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

router.route("/:bookId/favorite").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    try {
      const bookId = req.params.bookId.trim();
      const results = await favoriteBook(bookId, user.emailAddress);
      if (results.favoritedBook === true) {
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

router.route("/:bookId/return").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    try {
      const bookId = req.params.bookId.trim();
      const results = await returnBook(bookId, user.emailAddress);
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

router.route("/admin/approveBookRequest").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else if (user.role !== "admin") {
    return res.status(403).render("error", {
      title: "ERROR Page",
      error: "Forbidden",
    });
  } else {
    try {
      let requesterEmail = req.body.requesterEmail.trim().toLowerCase();
      let bookId = req.body.bookId.trim();
      bookId = xss(bookId);
      requesterEmail = xss(requesterEmail);
      const results = await approveRequest(bookId, requesterEmail);
      if (results.approved === true) {
        return res.redirect(`/admin`);
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
