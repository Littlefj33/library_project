import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("home", { title: "Home" });
});

router.route("/login").get(async (req, res) => {
  return res.render("login", { title: "Login" });
});

router.route("/register").get(async (req, res) => {
  return res.render("register", { title: "Register" });
});

router.route("/profile").get(async (req, res) => {
  return res.render("profile", { title: "Profile" });
});

router.route("/logout").get(async (req, res) => {
  return res.render("logout", { title: "Logout" });
});

router.route("/admin").get(async (req, res) => {
  return res.render("admin", { title: "Admin" });
});

export default router;
