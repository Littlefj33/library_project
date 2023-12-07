
export const searchEngine = async (collection, filter, keyword, projection) => {
    // since filter will be selected from a dropdown window, no validation is necessary
    if (!collection || typeof (collection) !== "object") {
        throw new Error("Warning: No/Invalid Collection is suplied in the routes!")
    }
    keyword = keyword.trim().toLowerCase()
    if (!keyword.length) {
        throw new Error({ InvalidArgument: true })
    }

    let query = {}
    query[filter] = { $regex: `/${keyword}/` }

    const searchResult = await collection.find(
        query,
        projection
    )

    if (!searchResult) {
        throw new Error("Something")
    }

    return searchResult
}