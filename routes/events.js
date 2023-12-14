import { dbTool } from "../data/dbTools.js";
import { events } from "../config/mongoCollections.js";
import { Router } from "express";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("events", { title: "Events" });
});

router.route("/:eventId").get(async (req, res) => {
  const eventId = req.params.eventId.trim();
  const eventCollection = await events();
  const data = await dbTool(eventCollection, "_id", eventId, {
    _id: 1,
    title: 1,
  });
  return res.render("eventDetails", { title: "Event Info", data });
});

/* Maybe remove?? */
router.route("/:eventId/comment").get(async (req, res) => {
  return res.render("eventComments", { title: "Events" });
});

/* Maybe remove?? */
router.route("/:eventId/join").get(async (req, res) => {
  return res.render("joinEvent", { title: "Events" });
});

router.route("/create").get(async (req, res) => {
  return res.render("createEvent", { title: "Events" });
});

export default router;
