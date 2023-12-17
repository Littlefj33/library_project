import { users, blogs, events } from "../config/mongoCollections.js"
import { readFile } from 'fs/promises';
import { ObjectId } from 'mongodb';

function addingBookIds(doc, bookIdsObject) {
    const bookIds = Object.values(bookIdsObject.insertedIds);
    doc.favorite_books = [bookIds[0]];
    doc.current_checked_out_books = bookIds.slice(0, 3);
    doc.checked_out_books = bookIds.slice(3, 6);
    doc.return_requests = doc.current_checked_out_books.splice(0, 2);
    return doc;
}

function convertToObjectId(doc) {
    if (doc._id && doc._id) {
        doc._id = new ObjectId(doc._id);
    }
    if (doc.comments) {
        doc.comments.forEach(comment => {
            if (comment._id && comment._id) {
                comment._id = new ObjectId(comment._id);
            }
        });
    }
    return doc;
}

export async function usersBlogsEventsSeed(bookIds) {
    const usersCollection = await users();
    const blogsCollection = await blogs();
    const eventsCollection = await events();
    await usersCollection.drop();
    await blogsCollection.drop();
    await eventsCollection.drop();
    try {
        const seedDataRaw1 = JSON.parse(await readFile('users.json', 'utf8'))
        let seedData1 = seedDataRaw1.map(convertToObjectId);
        seedData1 = seedData1.map(doc => addingBookIds(doc, bookIds));
        await usersCollection.insertMany(seedData1)
        const seedDataRaw2 = JSON.parse(await readFile('blogs.json', 'utf8'))
        const seedData2 = seedDataRaw2.map(convertToObjectId);
        await blogsCollection.insertMany(seedData2)
        const seedDataRaw3 = JSON.parse(await readFile('events.json', 'utf8'))
        const seedData3 = seedDataRaw3.map(convertToObjectId);
        await eventsCollection.insertMany(seedData3)
    } catch (e) {
        console.error(e)
        throw "Error: inserting seed content failed!"
    }
}
// const booksId = {
//     insertedIds: {
//         "0": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a1"),
//         "1": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a2"),
//         "2": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a3"),
//         "3": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a4"),
//         "4": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a5"),
//         "5": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a6"),
//         "6": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a7"),
//         "7": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a8"),
//         "8": new ObjectId("60a0f7d6e1e9e3b4e8f1b0a9"),
//         "9": new ObjectId("60a0f7d6e1e9e3b4e8f1b0aa"),
//     }
// };
// await usersBlogsEventsSeed(booksId).catch(console.error).then(() => { console.log("Done seeding database"); process.exit(0); });