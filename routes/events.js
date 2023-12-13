import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("events", { title: "Events" });
});

router.route("/info").get(async (req, res) => {
  return res.render("eventInfo", { title: "Events" });
});

router.route("/comments/:eventId").get(async (req, res) => {
  return res.render("eventComments", { title: "Events" });
});

router.route("/comments/:eventId/create").get(async (req, res) => {
  return res.render("createComment", { title: "Events" });
});

export default router;
