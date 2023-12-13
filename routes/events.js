import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("events", { title: "Events" });
});

router.route("/:eventId").get(async (req, res) => {
  return res.render("eventInfo", { title: "Events" });
});

router.route("/:eventId/comment").get(async (req, res) => {
  return res.render("eventComments", { title: "Events" });
});

router.route("/:eventId/join").get(async (req, res) => {
  return res.render("joinEvent", { title: "Events" });
});

router.route("/create").get(async (req, res) => {
  return res.render("createEvent", { title: "Events" });
});

export default router;
