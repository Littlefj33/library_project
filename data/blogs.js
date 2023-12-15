import { blogs, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { dbTool } from "./dbTools.js"

export const createBlog = async (author_email, title, content) => {
    if (!author_email || typeof author_email !== "string" || author_email.trim().length === 0)
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
        author_id = await dbTool(userCollection, "emailAddress", author_email, { _id: 1 });
    } catch (e) {
        throw "error in finding author using dbTool";
    }

    if (!author_id)
        throw "author not found";

    const blogCollection = await blogs();
    const newBlog = {
        author_id: new ObjectId((author_id[0])._id),
        title: title.trim(),
        content: content.trim(),
        date: new Date(),
        comments: [],
    };
    const insertInfo = await blogCollection.insertOne(newBlog);
    if (insertInfo.insertedCount === 0)
        throw "Could not add blog";
    return insertInfo;
};