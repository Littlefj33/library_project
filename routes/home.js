import { Router } from "express";
const router = Router();
import * as users_data from "../data/users.js";
import { users, books } from "../config/mongoCollections.js";
import { dbTool } from "../data/dbTools.js";
import { getBookName, getUserName, getUserEmail } from "../helpers.js";
import { approveRequest } from "../data/books.js";
import xss from "xss";

router.route("/").get(async (req, res) => {
  return res.render("home", { title: "Home" });
});

router
  .route("/login")
  .get(async (req, res) => {
    const user = req.session.user;
    if (user) {
      return res.redirect("/");
    } else {
      return res.render("login", {
        title: "Login",
        partial: "loginValidation",
      });
    }
  })
  .post(async (req, res) => {
    let { emailAddressInput, passwordInput } = req.body;
    emailAddressInput = xss(emailAddressInput);
    passwordInput = xss(passwordInput);
    try {
      const results = await users_data.loginUser(
        emailAddressInput,
        passwordInput
      );
      req.session.user = {
        firstName: results.firstName,
        lastName: results.lastName,
        emailAddress: results.emailAddress,
        role: results.role,
      };
      return res.redirect("/");
    } catch (e) {
      return res.status(400).render("login", {
        title: "Login",
        partial: "loginValidation",
        error: e,
      });
    }
  });

router
  .route("/register")
  .get(async (req, res) => {
    const user = req.session.user;
    if (user) {
      return res.redirect("/");
    } else {
      return res.render("register", {
        title: "Register",
        partial: "registerValidation",
      });
    }
  })
  .post(async (req, res) => {
    const body = req.body;
    try {
      if (body.confirmPasswordInput === undefined)
        throw "ERROR: Must enter password confirmation";
      if (body.confirmPasswordInput.trim() !== body.passwordInput.trim())
        throw "ERROR: Password confirmation must be same as password";
      const results = await users_data.registerUser(
        xss(body.firstNameInput),
        xss(body.lastNameInput),
        xss(body.dobInput),
        xss(body.phoneNumberInput),
        xss(body.emailAddressInput),
        xss(body.passwordInput),
        xss(body.roleInput)
      );
      if (results.insertedUser === true) {
        return res.redirect("/login");
      } else {
        return res.status(500).render("error", {
          title: "ERROR Page",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("register", {
        title: "Register",
        partial: "registerValidation",
        error: e,
      });
    }
  });

router.route("/profile").get(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    const userCollection = await users();
    const bookCollection = await books();

    let userInfo = await dbTool(
      userCollection,
      "emailAddress",
      user.emailAddress,
      {
        _id: 0,
        firstName: 1,
        lastName: 1,
        emailAddress: 1,
        dateOfBirth: 1,
        phoneNumber: 1,
        role: 1,
        favorite_books: 1,
        checked_out_books: 1,
        current_checked_out_books: 1,
        return_requests: 1,
        date_joined: 1,
      }
    );
    let favorite_books = [];
    for (let favorite of userInfo[0]["favorite_books"]) {
      let bookInfo = await dbTool(bookCollection, "_id", favorite.toString(), {
        _id: 0,
        title: 1,
      });
      favorite_books.push(bookInfo[0]["title"]);
    }

    let checked_out_books = [];
    for (let book of userInfo[0]["checked_out_books"]) {
      let bookInfo = await dbTool(bookCollection, "_id", book.toString(), {
        _id: 0,
        title: 1,
      });
      checked_out_books.push(bookInfo[0]["title"]);
    }

    let current_checked_out_books = [];
    for (let book of userInfo[0]["current_checked_out_books"]) {
      let bookInfo = await dbTool(bookCollection, "_id", book.toString(), {
        _id: 0,
        title: 1,
      });
      current_checked_out_books.push(bookInfo[0]["title"]);
    }

    let return_requests = [];
    for (let book of userInfo[0]["return_requests"]) {
      let bookInfo = await dbTool(bookCollection, "_id", book.toString(), {
        _id: 0,
        title: 1,
      });
      return_requests.push(bookInfo[0]["title"]);
    }

    delete userInfo[0]["favorite_books"];
    delete userInfo[0]["checked_out_books"];
    delete userInfo[0]["current_checked_out_books"];
    delete userInfo[0]["return_requests"];
    userInfo[0]["favorite_books"] = favorite_books;
    userInfo[0]["checked_out_books"] = checked_out_books;
    userInfo[0]["current_checked_out_books"] = current_checked_out_books;
    userInfo[0]["return_requests"] = return_requests;

    return res.render("profile", {
      title: "Profile",
      admin: user.role === "admin",
      user: userInfo[0],
    });
  }
});

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  return res.render("logout", { title: "Logout" });
});

router.route("/admin").get(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else if (user.role !== "admin") {
    return res
      .status(403)
      .render("error", { title: "ERROR Page", error: "Access Denied" });
  } else {
    let returnBookRequests = [];
    let bookApprovalRequests = [];
    try {
      const userCollection = await users();
      returnBookRequests = await userCollection
        .find(
          { return_requests: { $exists: true, $not: { $size: 0 } } },
          { projection: { _id: 1, return_requests: 1 } }
        )
        .toArray();
    } catch (e) {
      return res.status(500).render("error", {
        title: "ERROR Page",
        error: "Internal Server Error",
      });
    }
    returnBookRequests = await Promise.all(
      returnBookRequests.map(async (requester) => {
        const userName = await getUserName(requester._id.toString());
        const userEmail = await getUserEmail(requester._id.toString());
        const books = await Promise.all(
          requester.return_requests.map(async (bookId) => {
            const bookTitle = await getBookName(bookId.toString());
            return { _id: bookId, title: bookTitle };
          })
        );

        return {
          _id: requester._id,
          user: userName,
          emailAddress: userEmail,
          return_requests: books,
        };
      })
    );

    return res.render("admin", {
      title: "Admin",
      bookRequests: bookApprovalRequests,
      returnedBookRequests: returnBookRequests,
    });
  }
});

router.route("/admin/processReturn").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else if (user.role !== "admin") {
    return res
      .status(403)
      .render("error", { title: "ERROR Page", error: "Access Denied" });
  } else {
    let bookId = xss(req.body.bookId);
    let userEmailAddress = xss(req.body.requesterEmail);
    bookId = xss(bookId).trim();
    userEmailAddress = xss(userEmailAddress).trim().toLowerCase();
    bookId = typeof bookId === "string" ? bookId : bookId.toString();
    try {
      const results = await approveRequest(bookId, userEmailAddress);
      if (results.approved === true) {
        return res.redirect("/admin");
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
