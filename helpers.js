import { ObjectId } from "mongodb";
import { users, books } from "./config/mongoCollections.js";

export const getUserName = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("getUser: not a valid ID provided!");
  }
  id = (typeof id === 'string') ? new ObjectId(id) : id;
  const userCollection = await users();
  const queryResult = await userCollection.findOne({ _id: id }, { projection: { firstName: 1, lastName: 1 } });
  if (queryResult === null) {
    console.log(id)
    throw new Error("getUser: No User Found!");
  }
  const name = queryResult.firstName + " " + queryResult.lastName;
  return name;
};

export const getUserEmail = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("getUser: not a valid ID provided!");
  }
  // Convert string back to ObjectId if necessary
  id = (typeof id === 'string') ? new ObjectId(id) : id;
  const userCollection = await users();
  const queryResult = await userCollection.findOne({ _id: id });
  if (queryResult === null) {
    throw new Error("getUser: No User Found!");
  }
  return queryResult.emailAddress;
};

export const getBookName = async (bookId) => {
  // Convert string back to ObjectId if necessary
  bookId = (typeof bookId === 'string') ? new ObjectId(bookId) : bookId;
  if (!bookId || !ObjectId.isValid(bookId)) {
    throw new Error("getBookName: not a valid ID provided!");
  }
  const bookCollection = await books();
  const queryResult = await bookCollection.findOne({ _id: bookId });
  if (queryResult === null) {
    throw new Error("getBookName: No Book Found!");
  }
  return queryResult.title;
};

export function checkEmpty(infoObject) {
  let emptyArray = [];
  for (let [name, value] of Object.entries(infoObject)) {
    if (value == null) {
      emptyArray.push(name);
    }
  }
  if (emptyArray.length > 0) {
    throw new Error(
      `There are some empty fields need to be filled: [${emptyArray.join(
        ", "
      )}]`
    );
  }
}

export function checkValidString(str, name = "") {
  if (typeof str !== "string" || str.trim() === "") {
    throw new Error(`Input ${name} is not a string or it is empty!`);
  }
  return str.trim();
}

export function checkValidDateTime(str) {
  let eventDate = new Date(str);
  let now = new Date();
  if (isNaN(eventDate.getTime())) {
    throw new Error("The date and time is invalid!");
  }
  let diff = eventDate.getTime() - now.getTime();
  if (diff / 60 / 1000 <= 30) {
    throw new Error(
      `Event start time must be at least 30 minutes in the future.`
    );
  }
  return eventDate;
}

export function checkValidNumber(str) {
  var num = Number(str);
  if (!isNaN(num)) {
    return num;
  } else {
    return null;
  }
}
