import { dbTool } from "../data/dbTools.js";
import { events, users } from "../config/mongoCollections.js";
import { Router } from "express";
import { createEvent } from "../data/events.js";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("events", { title: "Events" });
});

router
  .route("/create")
  .get(async (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect("/login");
    } else {
      return res.render("createEvent", {
        title: "Create Event",
        partial: "createEventValidation",
      });
    }
  })
  .post(async (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect("/login");
    } else {
      // prettier-ignore
      const { title, date_time, address, state, zip, description, attending_fee, capacity, age_limit } = req.body;
      try {
        // prettier-ignore
        const results = await createEvent(user.emailAddress, title, date_time, address, state, zip, description, attending_fee, capacity, age_limit);
        if (results.insertedEvent === true) {
          return res.redirect(`/events/${results.id}`);
        } else {
          return res.status(500).render("error", {
            title: "ERROR Page",
            error: "Internal Server Error",
          });
        }
      } catch (e) {
        return res.status(400).render("createEvent", {
          title: "Create Event",
          partial: "createEventValidation",
          error: e,
        });
      }
    }
  });

router.route("/:eventId").get(async (req, res) => {
  const eventId = req.params.eventId.trim();
  const eventCollection = await events();
  const userCollection = await users();

  let data;
  try {
    let eventData = await dbTool(eventCollection, "_id", eventId, {
      _id: 0,
      title: 1,
      organizer_id: 1,
      date_time: 1,
      location: 1,
      description: 1,
      attending_fee: 1,
      capacity: 1,
      age_limit: 1,
      attendees: 1,
      comments: 1,
      canceled: 1,
    });
    let organizerInfo = await dbTool(
      userCollection,
      "_id",
      eventData[0]["organizer_id"].toString(),
      { _id: 0, firstName: 1, lastName: 1, emailAddress: 1 }
    );
    delete eventData[0]["organizer_id"];
    eventData[0]["organizer_info"] = organizerInfo[0];
    data = eventData[0];
  } catch (e) {
    return res.status(404).render("error", {
      title: "ERROR Page",
      error: "Page not found",
    });
  }
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

export default router;
