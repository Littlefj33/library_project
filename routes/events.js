import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("events", { title: "Events" });
});

export default router;
