import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("profile", { title: "Profile" });
});

export default router;
