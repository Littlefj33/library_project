import { blogs } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
export const createBlog = async (author_id, title, content) => {

    if (!author_id || ObjectId.isValid(author_id) === false)
        throw "author id missing or invalid";
    if (!title || typeof title !== "string" || title.trim().length === 0)
        throw "title missing or invalid";
    if (!content || typeof content !== "string" || content.trim().length === 0)
        throw "content missing or invalid";

    const blogCollection = await blogs();
    const newBlog = {
        author_id: author_id,
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