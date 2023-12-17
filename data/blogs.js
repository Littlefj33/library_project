import { blogs, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { dbTool } from "./dbTools.js";

export const createBlog = async (author_email, title, content) => {
  if (
    !author_email ||
    typeof author_email !== "string" ||
    author_email.trim().length === 0
  )
    throw "author email missing or invalid";
  if (!title || typeof title !== "string" || title.trim().length === 0)
    throw "title missing or invalid";
  if (!content || typeof content !== "string" || content.trim().length === 0)
    throw "content missing or invalid";

  let userCollection = undefined;
  try {
    userCollection = await users();
  } catch (e) {
    throw "user collection not found";
  }
  let author_id = undefined;

  try {
    author_id = await dbTool(userCollection, "emailAddress", author_email, {
      _id: 1,
    });
  } catch (e) {
    throw "error in finding author using dbTool";
  }

  if (!author_id) throw "author not found";

  const blogCollection = await blogs();
  const newBlog = {
    author_id: new ObjectId(author_id[0]._id),
    title: title.trim(),
    content: content.trim(),
    date_posted: new Date(),
    comments: [],
  };
  const insertInfo = await blogCollection.insertOne(newBlog);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error("Could not add blog!");
  }

  const updatedUserInfo = await userCollection.findOneAndUpdate(
    { _id: new ObjectId(author_id[0]._id) },
    { $push: { blogs_created: insertInfo.insertedId } },
    { returnDocument: "after" }
  );

  if (!updatedUserInfo) throw "ERROR: User update failed";

  return { insertedEvent: true, id: insertInfo.insertedId };
};

export const addComment = async (blogId, user_email_address, content) => {
  if (
    user_email_address === undefined ||
    typeof user_email_address !== "string" ||
    user_email_address.trim().length === 0
  )
    throw "Author email missing or invalid";

  if (!content || typeof content !== "string" || content.trim().length === 0)
    throw "Content missing or invalid";

  blogId = blogId.trim();
  if (!ObjectId.isValid(blogId)) throw "ERROR: Invalid object ID";

  user_email_address = user_email_address.toLowerCase().trim();
  content = content.trim();

  const blogCollection = await blogs();
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

  const updatedBlogInfo = await blogCollection.findOneAndUpdate(
    { _id: new ObjectId(blogId) },
    { $push: { comments: { authorId, content } } },
    { returnDocument: "after" }
  );
  if (!updatedBlogInfo) throw "ERROR: User update failed";

  delete authorInfo[0]["_id"];

  return { insertedEvent: true, authorInfo: authorInfo[0] };
};
