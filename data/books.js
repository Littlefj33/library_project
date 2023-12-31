import { books, users } from "../config/mongoCollections.js";
import { dbTool } from "./dbTools.js";
import { ObjectId } from "mongodb";

export const addReview = async (
  bookId,
  user_email_address,
  content,
  rating
) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  if (!content || typeof content !== "string" || content.trim().length === 0)
    throw "Content missing or invalid";

  if (isNaN(Number(rating))) throw "ERROR: Review must be number";
  rating = Number(rating);
  if (rating < 0 || rating > 5) throw "ERROR: Review must be between 0 and 5";

  bookId = bookId.trim();
  if (!ObjectId.isValid(bookId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();
  content = content.trim();

  const bookCollection = await books();
  const userCollection = await users();

  let bookData = await dbTool(bookCollection, "_id", bookId, {
    _id: 1,
    reviews: 1,
  });

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

  for (let review of bookData[0]["reviews"]) {
    if (review["authorId"].toString() === authorId.toString())
      throw "ERROR: User already made a review";
  }

  const updatedBookInfo = await bookCollection.findOneAndUpdate(
    { _id: new ObjectId(bookId) },
    { $push: { reviews: { authorId, content, rating } } },
    { returnDocument: "after" }
  );
  if (!updatedBookInfo) throw "ERROR: User update failed";

  delete authorInfo[0]["_id"];

  return { insertedBook: true, authorInfo: authorInfo[0] };
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
      current_borrowers: 1,
    });
  } catch (e) {
    throw "ERROR: Cannot find user";
  }

  for (let borrower of bookInfo[0]["current_borrowers"]) {
    if (borrower.toString() === userInfo[0]["_id"].toString())
      throw "ERROR: User already is borrowing book";
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
      { $push: { current_checked_out_books: new ObjectId(bookId) } },
      { returnDocument: "after" }
    );
    if (!updatedUserInfo) throw "ERROR: User update failed";

    const updatedUserInfo2 = await userCollection.findOneAndUpdate(
      { _id: userId },
      { $push: { checked_out_books: new ObjectId(bookId) } },
      { returnDocument: "after" }
    );
    if (!updatedUserInfo2) throw "ERROR: User update failed";
  } else {
    throw "ERROR: Book currently out of stock";
  }
  return { insertedBook: true };
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
      { _id: 1, return_requests: 1 }
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
      current_borrowers: 1,
    });
  } catch (e) {
    throw "ERROR: Cannot find book";
  }

  let borrowing = false;
  for (let borrower of bookInfo[0]["current_borrowers"]) {
    if (borrower.toString() === userId.toString()) {
      borrowing = true;
    }
  }
  if (!borrowing) throw "ERROR: User is not currently borrowing book";

  for (let requests of userInfo[0]["return_requests"]) {
    if (requests.toString() === bookId)
      throw "ERROR: User already is returning book";
  }

  const updatedUserInfo = await userCollection.findOneAndUpdate(
    { _id: userId },
    { $push: { return_requests: new ObjectId(bookId) } },
    { returnDocument: "after" }
  );
  if (!updatedUserInfo) throw "ERROR: User update failed";

  return { insertedBook: true };
};

export const approveRequest = async (bookId, user_email_address) => {
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
      {
        _id: 1,
        current_checked_out_books: 1,
        return_requests: 1,
      }
    );
  } catch (e) {
    throw "ERROR: Cannot find user";
  }
  const userId = userInfo[0]["_id"];
  const updatedUserInfo = await userCollection.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { return_requests: new ObjectId(bookId) },
    },
    { returnDocument: "after" }
  );
  if (!updatedUserInfo) throw "ERROR: User update failed";

  const updatedUserInfo2 = await userCollection.findOneAndUpdate(
    { _id: userId },
    {
      $pull: { current_checked_out_books: new ObjectId(bookId) },
    },
    { returnDocument: "after" }
  );
  if (!updatedUserInfo2) throw "ERROR: User update failed";

  const updatedBookInfo = await bookCollection.findOneAndUpdate(
    { _id: new ObjectId(bookId) },
    { $pull: { current_borrowers: userId } },
    { returnDocument: "after" }
  );
  if (!updatedBookInfo) throw "ERROR: Book update failed";

  const updatedBookInfo2 = await bookCollection.findOneAndUpdate(
    { _id: new ObjectId(bookId) },
    { $inc: { current_stock: 1 } },
    { returnDocument: "after" }
  );
  if (!updatedBookInfo2) throw "ERROR: Book update failed";

  return { approved: true };
};

export const favoriteBook = async (bookId, user_email_address) => {
  if (
    !user_email_address ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  ) {
    throw "Author email missing or invalid";
  }

  bookId = bookId.trim();
  if (!ObjectId.isValid(bookId)) {
    throw "Invalid book ID";
  }

  user_email_address = user_email_address.toLowerCase().trim();

  const bookCollection = await books();
  const userCollection = await users();

  // Check if the book exists
  const book = await dbTool(bookCollection, "_id", bookId, { _id: 1 });
  if (!book) {
    throw "Book not found";
  }

  // Check if the user exists and update their favorite_books list
  const updateResult = await userCollection.updateOne(
    { emailAddress: user_email_address },
    { $addToSet: { favorite_books: new ObjectId(bookId) } }
  );

  if (!updateResult.matchedCount) {
    throw "User not found";
  }

  if (!updateResult.modifiedCount) {
    throw "Book already in favorites or update failed";
  }

  return { favoritedBook: true };
};
