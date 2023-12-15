import { Router } from "express";
const router = Router();
import * as users from "../data/users.js";

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
      const results = await users.loginUser(emailAddressInput, passwordInput);
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
      const results = await users.registerUser(
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
    return res.render("profile", {
      title: "Profile",
      admin: user.role === "admin",
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
    return res.render("admin", { title: "Admin" });
  }
});

export default router;
