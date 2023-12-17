import { ObjectId } from "mongodb";
import { users, books } from "./config/mongoCollections.js";

export const getUserName = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("getUser: not a valid ID provided!");
  }
  const userCollection = await users();
  const queryResult = await userCollection.findOne({ _id: id });
  if (queryResult.count() === 0) {
    throw new Error("getUser: No User Found!");
  }
  const name = queryResult.first_name + " " + queryResult.last_name;
  return name;
};

export const getUserEmail = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("getUser: not a valid ID provided!");
  }
  const userCollection = await users();
  const queryResult = await userCollection.findOne({ _id: id });
  if (queryResult.count() === 0) {
    throw new Error("getUser: No User Found!");
  }
  return queryResult.email;
}

export const getBookName = async (bookId) => {
  if (!bookId || !ObjectId.isValid(bookId)) {
    throw new Error("getBookName: not a valid ID provided!");
  }
  const bookCollection = await books();
  const queryResult = await bookCollection.findOne({ _id: bookId });
  if (queryResult.count() === 0) {
    throw new Error("getBookName: No Book Found!");
  }
  return queryResult.title;
}

export function checkEmpty(infoObject) {
  let emptyArray = []
  for (let [name, value] of Object.entries(infoObject)) {
    if (value == null) {
      emptyArray.push(name)
    }
  }
  if (emptyArray.length > 0) {
    throw new Error(`There are some empty fields need to be filled: [${emptyArray.join(', ')}]`)
  }
}

export function checkValidString(str, name = "") {
  if (typeof str !== 'string' || str.trim() === '') {
    throw new Error(`Input ${name} is not a string or it is empty!`);
  }
  return str.trim();
}

export function checkValidDateTime(str) {
  let eventDate = new Date(str);
  let now = new Date()
  if (isNaN(eventDate.getTime())) {
    throw new Error('The date and time is invalid!')
  }
  let diff = eventDate.getTime() - now.getTime();
  if (diff / 60 / 1000 <= 30) {
    throw new Error(`Event start time must be at least 30 minutes in the future.`)
  }
  return eventDate
}

export function checkValidNumber(str) {
  var num = Number(str)
  if (!isNaN(num)) {
    return num
  } else {
    return null
  }
}
