import { events, users } from "../config/mongoCollections.js";
import { dbTool } from "./dbTools.js";
import { ObjectId } from "mongodb";
import * as helpers from "../helpers.js";

export const createEvent = async (
  user_email_address,
  title,
  date_time,
  address,
  state,
  zip,
  description,
  attending_fee,
  capacity,
  age_limit
) => {
  const eventInfo = {
    user_email_address,
    title,
    date_time,
    address,
    state,
    zip,
    description,
    attending_fee,
    capacity,
    age_limit,
  };
  // Empty Check
  helpers.checkEmpty(eventInfo);

  // String Check
  title = helpers.checkValidString(title, "title");
  date_time = helpers.checkValidString(date_time, "date and time");
  address = helpers.checkValidString(address, "address");
  state = helpers.checkValidString(state, "state");
  zip = helpers.checkValidString(zip, "zip code");
  description = helpers.checkValidString(description, "description");
  attending_fee = helpers.checkValidString(attending_fee, "attending fee");
  age_limit = helpers.checkValidString(age_limit, "age limit");
  capacity = helpers.checkValidString(capacity, "capacity");

  // title more than 5 character
  if (title.length < 5) {
    throw new Error("Event title should be at least 5 character!");
  }

  // check date_time validation
  let dateInfo = helpers.checkValidDateTime(date_time);

  // description more than 25 character
  if (description.length < 25) {
    throw new Error("Event description should be at least 25 character!");
  }

  // check numbers
  let capacityVal = helpers.checkValidNumber(capacity, "max capacity");
  let attending_feeVal = helpers.checkValidNumber(
    attending_fee,
    "Attending fee"
  );
  let age_limitVal = helpers.checkValidNumber(age_limit, "Age limit");
  if (!capacityVal || capacityVal <= 0 || !Number.isInteger(capacityVal)) {
    throw new Error(
      "Capacity should be a positive integer and the value should be greater than 0"
    );
  }

  if (
    attending_feeVal === undefined ||
    attending_feeVal < 0 ||
    !Number.isInteger(attending_feeVal * 100)
  ) {
    throw new Error(
      "Attending fee should be a integer, a positive float with 2 decimal places, or 0"
    );
  }

  if (!age_limitVal || age_limitVal <= 5 || !Number.isInteger(age_limitVal)) {
    throw new Error("Age limit should be a integer great than 5!");
  }

  // check location
  if (address.length < 3) {
    throw new Error(`Address of location should be at least 3 character!`);
  }

  // prettier-ignore
  const USStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]
  if (!USStates.includes(state)) {
    throw new Error(`Invalid state "${state}"!`);
  }
  if (!/^[0-9]{5}$/.test(zip)) {
    throw new Error(`Invalid zip code:"${zip}"!`);
  }
  // Get the organizer's ID from the database using their email address
  user_email_address = user_email_address.trim().toLowerCase();

  const userCollection = await users();
  let organizerInfo = await dbTool(
    userCollection,
    "emailAddress",
    user_email_address,
    { _id: 1 }
  );

  let newEvent = {
    title,
    organizer_id: organizerInfo[0]["_id"],
    date_time: dateInfo,
    location: {
      address,
      state,
      zip,
    },
    description,
    attending_fee: attending_feeVal,
    capacity: capacityVal,
    age_limit: age_limitVal,
    attendees: [],
    comments: [],
    canceled: false,
  };
  const eventCollection = await events();
  const insertInfo = await eventCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not add event!");
  }
  return { insertedEvent: true, id: insertInfo.insertedId };
};

export const addComment = async (eventId, user_email_address, content) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  if (!content || typeof content !== "string" || content.trim().length === 0)
    throw "Content missing or invalid";

  eventId = eventId.trim();
  if (!ObjectId.isValid(eventId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();
  content = content.trim();

  const eventCollection = await events();
  const userCollection = await users();
  let authorInfo;
  try {
    authorInfo = await dbTool(
      userCollection,
      "emailAddress",
      user_email_address,
      { _id: 1, firstName: 1, lastName: 1, emailAddress: 1 }
    );
  } catch (e) {
    throw "ERROR: Cannot find author";
  }
  const authorId = authorInfo[0]["_id"];

  const updatedEventInfo = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(eventId) },
    { $push: { comments: { authorId, content } } },
    { returnDocument: "after" }
  );
  if (!updatedEventInfo) throw "ERROR: User update failed";

  delete authorInfo[0]["_id"];

  return { insertedEvent: true, authorInfo: authorInfo[0] };
};

export const addAttendee = async (eventId, user_email_address) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  eventId = eventId.trim();
  if (!ObjectId.isValid(eventId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();

  const eventCollection = await events();
  const userCollection = await users();

  let eventInfo = await dbTool(eventCollection, "_id", eventId, {
    _id: 0,
    capacity: 1,
    attendees: 1,
    age_limit: 1,
  });
  if (eventInfo[0]["capacity"] <= eventInfo[0]["attendees"].length)
    throw "ERROR: Cannot join event - Max capacity";

  let userInfo;
  try {
    userInfo = await dbTool(
      userCollection,
      "emailAddress",
      user_email_address,
      { _id: 1, dateOfBirth: 1 }
    );
  } catch (e) {
    throw "ERROR: Cannot find user";
  }

  const userDOB = userInfo[0]["dateOfBirth"];
  const eventAgeLimit = eventInfo[0]["age_limit"];
  const curDate = new Date();
  const allowedDate = new Date(
    curDate.getFullYear() - eventAgeLimit,
    curDate.getMonth(),
    curDate.getDate()
  );
  if (!(allowedDate > userDOB))
    throw "ERROR: Must be be above age limit to join event";

  const userId = userInfo[0]["_id"];
  for (let attendee of eventInfo[0]["attendees"]) {
    if (attendee.toString() === userId.toString())
      throw "ERROR: User already joined this event";
  }

  const updatedEventInfo = await eventCollection.findOneAndUpdate(
    { _id: new ObjectId(eventId) },
    { $push: { attendees: userId } },
    { returnDocument: "after" }
  );
  if (!updatedEventInfo) throw "ERROR: User update failed";

  const updatedUserInfo = await userCollection.findOneAndUpdate(
    { _id: userId },
    { $push: { events_joined: new ObjectId(eventId) } },
    { returnDocument: "after" }
  );
  if (!updatedUserInfo) throw "ERROR: User update failed";

  return { insertedEvent: true };
};
