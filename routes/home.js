import { Router } from "express";
const router = Router();
import * as users_data from "../data/users.js";
import { users } from "../config/mongoCollections.js";
import { dbTool } from "../data/dbTools.js";

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
    const { emailAddressInput, passwordInput } = req.body;
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
        body.firstNameInput,
        body.lastNameInput,
        body.dobInput,
        body.phoneNumberInput,
        body.emailAddressInput,
        body.passwordInput,
        body.roleInput
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
      returnBookRequests = (
        await userCollection.find(
          { return_requests: { $exists: true, $not: { $size: 0 } } },
          { _id: 1, return_requests: 1 }
        )
      ).toArray();
      bookApprovalRequests = (
        await userCollection.find(
          { requested_books: { $exists: true, $not: { $size: 0 } } },
          { _id: 1, " requested_books": 1 }
        )
      ).toArray();
    } catch (e) {
      return res.status(500).render("error", {
        title: "ERROR Page",
        error: "Internal Server Error",
      });
    }
    return res.render("admin", {
      title: "Admin",
      bookRequests: bookApprovalRequests,
      returnedBookRequests: returnBookRequests,
    });
  }
});

export default router;
