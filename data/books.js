import { books, users } from "../config/mongoCollections.js";
import { dbTool } from "./dbTools.js";
import { ObjectId } from "mongodb";

/* TODO Add functionality in routes and test all functions */

export const addReview = async (
  bookId,
  user_email_address,
  content,
  review
) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  if (!content || typeof content !== "string" || content.trim().length === 0)
    throw "Content missing or invalid";

  if (isNaN(review)) throw "ERROR: Review must be number";
  if (review < 0 || review > 5) throw "ERROR: Review must be between 0 and 5";

  bookId = bookId.trim();
  if (!ObjectId.isValid(bookId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();
  content = content.trim();

  const bookCollection = await books();
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

  const updatedBookInfo = await bookCollection.findOneAndUpdate(
    { _id: new ObjectId(bookId) },
    { $push: { reviews: { authorId, content, review } } },
    { returnDocument: "after" }
  );
  if (!updatedBookInfo) throw "ERROR: User update failed";

  delete authorInfo[0]["_id"];

  return { insertedEvent: true, authorInfo: authorInfo[0] };
};

export const requestBook = async (bookId, user_email_address) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  bookId = bookId.trim();
  if (!ObjectId.isValid(bookId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();

  const bookCollection = await books();
  const userCollection = await users();

  let userInfo;
  try {
    userInfo = await dbTool(
      userCollection,
      "emailAddress",
      user_email_address,
      { _id: 1 }
    );
  } catch (e) {
    throw "ERROR: Cannot find user";
  }
  const userId = userInfo[0]["_id"];

  let bookInfo;
  try {
    bookInfo = await dbTool(bookCollection, "_id", bookId, {
      _id: 1,
      current_stock: 1,
    });
  } catch (e) {
    throw "ERROR: Cannot find user";
  }

  if (bookInfo[0]["current_stock"] > 0) {
    const updatedBookInfo = await bookCollection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $inc: { current_stock: -1 } },
      { returnDocument: "after" }
    );
    if (!updatedBookInfo) throw "ERROR: User update failed";

    const updatedBookInfo2 = await bookCollection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $push: { current_borrowers: userId } },
      { returnDocument: "after" }
    );
    if (!updatedBookInfo2) throw "ERROR: User update failed";

    const updatedUserInfo = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $push: { return_requests: new ObjectId(bookId) } },
      { returnDocument: "after" }
    );
    if (!updatedUserInfo) throw "ERROR: User update failed";
  } else {
    throw "ERROR: Book currently out of stock";
  }
  return { insertedEvent: true };
};

export const returnBook = async (bookId, user_email_address) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  bookId = bookId.trim();
  if (!ObjectId.isValid(bookId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();

  const bookCollection = await books();
  const userCollection = await users();

  let userInfo;
  try {
    userInfo = await dbTool(
      userCollection,
      "emailAddress",
      user_email_address,
      { _id: 1 }
    );
  } catch (e) {
    throw "ERROR: Cannot find user";
  }
  const userId = userInfo[0]["_id"];

  let bookInfo;
  try {
    bookInfo = await dbTool(bookCollection, "_id", bookId, {
      _id: 1,
      current_stock: 1,
    });
  } catch (e) {
    throw "ERROR: Cannot find user";
  }

  if (bookInfo[0]["current_stock"] < bookInfo[0]["total_stock"]) {
    const updatedBookInfo = await bookCollection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $inc: { current_stock: 1 } },
      { returnDocument: "after" }
    );
    if (!updatedBookInfo) throw "ERROR: User update failed";

    const updatedBookInfo2 = await bookCollection.findOneAndUpdate(
      { _id: new ObjectId(bookId) },
      { $pull: { current_borrowers: userId } },
      { returnDocument: "after" }
    );
    if (!updatedBookInfo2) throw "ERROR: User update failed";

    const updatedUserInfo = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $pull: { return_requests: new ObjectId(bookId) } },
      { returnDocument: "after" }
    );
    if (!updatedUserInfo) throw "ERROR: User update failed";
  } else {
    throw "ERROR: This book is already fully stocked";
  }
  return { insertedEvent: true };
};
