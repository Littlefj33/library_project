import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";

export const getUser = async (id) => {
  if (!id || !ObjectId.isValid(id)) {
    throw new Error("getUser: not a valid ID provided!");
  }
  const userCollection = await users();
  const queryResult = await userCollection.findOne({ _id: id });
  if (queryResult.count() === 0) {
    throw new Error("getUser: No User Found!");
  }
  return queryResult;
};
