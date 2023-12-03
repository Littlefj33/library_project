import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("home", { title: "Home" });
});

export default router;
