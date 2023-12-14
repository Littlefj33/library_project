export const dbTool = async (collection, field, keyword, proj, action) => {
  // since filter will be selected from a dropdown window, no validation is necessary
  if (!collection || typeof collection !== "object") {
    console.log(collection)
    throw new Error("Warning: No/Invalid Collection is suplied in the routes!");
  }
  if (!proj) {
    proj = {};
  }
  keyword = keyword.trim().toLowerCase();
  if (!keyword.length) {
    throw new Error({ InvalidArgument: true });
  }

  let query = {};
  let queryResult = undefined;
  query[field] = { $regex: new RegExp(keyword) };

  if (action) {
    if (action.set) {
      try {
        queryResult = await collection.findOneAndUpdate(
          query,
          { $set: action.set },
          {
            projection: proj,
          }
        );
      } catch (e) {
        throw new Error(e.message);
      }
    } else if (action.push) {
      try {
        queryResult = await collection.findOneAndUpdate(
          query,
          { $push: action.push },
          {
            projection: proj,
          }
        );
      } catch (e) {
        throw new Error(e.message);
      }
    } else if (action.delete) {
      try {
        queryResult = await collection.findOneAndDelete(query);
      } catch (e) {
        throw new Error(e.message);
      }
    }
  } else {
    try {
      queryResult = await collection.find(query, { projection: proj }).toArray();
    } catch (e) {
      console.error(e);
      throw new Error(e.message);
    }
    if (!queryResult) {
      return null;
    }
  }
  if (typeof queryResult === "undefined") {
    throw new Error("Mongo: Could not fetch the document!");
  }

  return queryResult;
};
