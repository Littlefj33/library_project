import { dbTool } from "../data/dbTools.js";
import { events, users } from "../config/mongoCollections.js";
import { Router } from "express";
import { createEvent, addComment, addAttendee } from "../data/events.js";
const router = Router();

router.route("/").get(async (req, res) => {
  try {
    const eventCollection = await events();
    let eventList = await eventCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            title: 1,
            date_time: 1,
            description: 1,
            location: 1,
            attendees: 1,
            comments: 1,
          },
        }
      )
      .toArray();
    if (!eventList) throw "ERROR: Could not get all events";
    const user = req.session.user;
    const userCollection = await users();
    let eventIndex = 0;
    for (const event of eventList) {
      if (user) {
        let userInfo = await dbTool(
          userCollection,
          "emailAddress",
          user.emailAddress,
          { _id: 1 }
        );
        let joinedBool = false;
        for (let attendee of event["attendees"]) {
          if (attendee.toString() === userInfo[0]["_id"].toString()) {
            joinedBool = true;
          }
        }
        if (joinedBool) {
          eventList[eventIndex]["user_joined"] = true;
        } else {
          eventList[eventIndex]["user_joined"] = false;
        }
      } else {
        eventList[eventIndex]["user_joined"] = false;
      }
      eventIndex++;
    }

    return res.render("events", {
      title: "Events",
      data: eventList,
      partial: "search",
    });
  } catch (e) {
    return res.status(500).render("error", {
      title: "ERROR Page",
      error: "Internal Server Error",
    });
  }
});

router.route("/json").get(async (req, res) => {
  try {
    const eventsCollection = await events();
    const userCollection = await users();
    let eventList = await eventsCollection
      .find(
        {},
        {
          projection: {
            _id: 1,
            organizer_id: 1,
          },
        }
      )
      .toArray();
    if (!eventList) throw "ERROR: Could not get all books";
    let eventIndex = 0;
    for (const event of eventList) {
      let organizerInfo = await dbTool(
        userCollection,
        "_id",
        event["organizer_id"].toString(),
        { _id: 0, firstName: 1, lastName: 1 }
      );

      delete eventList[eventIndex]["organizer_id"];
      eventList[eventIndex]["organizer_info"] = organizerInfo[0];
      eventIndex++;
    }

    return res.json(eventList);
  } catch (e) {
    return res.status(500).send(e);
  }
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
    /* Get event data */
    let eventData = await dbTool(eventCollection, "_id", eventId, {
      _id: 1,
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

    /* Get organizer data */
    let organizerInfo = await dbTool(
      userCollection,
      "_id",
      eventData[0]["organizer_id"].toString(),
      { _id: 0, firstName: 1, lastName: 1, emailAddress: 1 }
    );

    delete eventData[0]["organizer_id"];
    eventData[0]["organizer_info"] = organizerInfo[0];

    /* Get user data & update comment in local event's data */
    let newComments = [];
    for (let comment of eventData[0]["comments"]) {
      let authorInfo = await dbTool(
        userCollection,
        "_id",
        comment["authorId"].toString(),
        { _id: 0, firstName: 1, lastName: 1 }
      );
      delete comment["authorId"];
      comment["author_info"] = authorInfo[0];
      newComments.push(comment);
    }
    eventData[0]["comments"] = newComments;

    /* Send event data */
    data = eventData[0];
  } catch (e) {
    return res.status(404).render("error", {
      title: "ERROR Page",
      error: "Page not found",
    });
  }
  return res.render("eventDetails", { title: "Event Info", data });
});

router.route("/:eventId/comment").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    const body = req.body;
    const eventId = req.params.eventId.trim();
    const content = body[`content-${eventId}`];
    try {
      const results = await addComment(eventId, user.emailAddress, content);
      if (results.insertedEvent === true) {
        return res.redirect(`/events/${eventId}`);
      } else {
        return res.status(500).render("error", {
          title: "ERROR Page",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "ERROR Page",
        error: e,
      });
    }
  }
});

router.route("/:eventId/join").post(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    return res.redirect("/login");
  } else {
    try {
      const eventId = req.params.eventId.trim();
      const results = await addAttendee(eventId, user.emailAddress);
      if (results.insertedEvent === true) {
        return res.redirect(`/events/${eventId}`);
      } else {
        return res.status(500).render("error", {
          title: "ERROR Page",
          error: "Internal Server Error",
        });
      }
    } catch (e) {
      return res.status(400).render("error", {
        title: "ERROR Page",
        error: e,
      });
    }
  }
});

export default router;
