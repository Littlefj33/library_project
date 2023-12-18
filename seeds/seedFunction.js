import { registerUser } from "../data/users.js"
import { dbTool } from "../data/dbTools.js"
import { books, blogs, events } from "../config/mongoCollections.js"
// import { create } from "handlebars"
import * as blogFunc from "../data/blogs.js"
import { createEvent, addAttendee, addComment } from "../data/events.js"
import { addReview, favoriteBook, requestBook, returnBook } from "../data/books.js"

export async function seedData() {
  const emailAddress1 = "test1@gamil.com"
  const emailAddress2 = "test2@gmail.com"
  const password = "Test1234!"

  try {
    await registerUser(
      "testOne",
      "testOne",
      "12-01-1999",
      "509-440-8879",
      emailAddress1,
      password,
      "user"
    )
    await registerUser(
      "testTwo",
      "testTwo",
      "12-01-1999",
      "509-890-8879",
      emailAddress2,
      password,
      "admin"
    )
    // const userCollection = await users()
    // const user1_Id = await dbTool(userCollection, "emailAddress", emailAddress1, { "_id": 1 })[0]["_id"]
    // const user2_Id = await dbTool(userCollection, "emailAddress", emailAddress2, { "_id": 1 })[0]["_id"]
    const bookCollection = await books()
    let book1_Id = (await dbTool(bookCollection, "title", "Prime Suspect 3", { "_id": 1 }))[0]["_id"]
    let book2_Id = (await dbTool(bookCollection, "title", "White Hunter, Black Heart", { "_id": 1 }))[0]["_id"]
    let book3_Id = (await dbTool(bookCollection, "title", "Bambou", { "_id": 1 }))[0]["_id"]
    let book4_Id = (await dbTool(bookCollection, "title", "Assassination of a High School President", { "_id": 1 }))[0]["_id"]
    let book5_Id = (await dbTool(bookCollection, "title", "Scissere", { "_id": 1 }))[0]["_id"]

    await favoriteBook(book1_Id.toString(), emailAddress1)
    await favoriteBook(book2_Id.toString(), emailAddress2)

    await requestBook(book3_Id.toString(), emailAddress1)
    await requestBook(book4_Id.toString(), emailAddress2)

    await requestBook(book5_Id.toString(), emailAddress1)
    await requestBook(book5_Id.toString(), emailAddress2)


    await returnBook(book5_Id.toString(), emailAddress1)
    await returnBook(book4_Id.toString(), emailAddress2)

    await addReview(book5_Id.toString(), emailAddress1, "Review 1 Here", 4)
    await addReview(book4_Id.toString(), emailAddress2, "Review 2 Here", 2)

    const eventCollection = await events()
    await createEvent(
      emailAddress1,
      "Title 1 Here",
      "2024-12-11T03:12:00.000Z",
      "404 Charlie St",
      "MA",
      "08898",
      "Description 1 Here...............................................",
      "4",
      "2",
      "18"
    )
    await createEvent(
      emailAddress2,
      "Title 2 Here",
      "2024-08-11T03:08:00.000Z",
      "788 Charlie St",
      "MA",
      "08898",
      "Description 2 Here......................................................",
      "4",
      "2",
      "24",
    )
    const event1_Id = (await dbTool(eventCollection, "title", "Title 1 Here", { "_id": 1 }))[0]["_id"]
    const event2_Id = (await dbTool(eventCollection, "title", "Title 2 Here", { "_id": 1 }))[0]["_id"]

    await addAttendee(event1_Id.toString(), emailAddress2)
    await addAttendee(event2_Id.toString(), emailAddress1)

    await addComment(event2_Id.toString(), emailAddress1, "Comment 1 Here")
    await addComment(event1_Id.toString(), emailAddress2, "Comment 2 Here")



    const blogCollection = await blogs()

    await blogFunc.createBlog(emailAddress1, "Title 1 Here", "Content 1 Here")
    await blogFunc.createBlog(emailAddress2, "Title 2 Here", "Content 2 Here")
    const blog1_Id = (await dbTool(blogCollection, "title", "Title 1 Here", { "_id": 1 }))[0]["_id"]
    const blog2_Id = (await dbTool(blogCollection, "title", "Title 2 Here", { "_id": 1 }))[0]["_id"]

    await blogFunc.addComment(blog1_Id.toString(), emailAddress2, "Comment 1 Here")
    await blogFunc.addComment(blog2_Id.toString(), emailAddress1, "Comment 2 Here")

  } catch (e) {
    console.error(e)
    throw "Error in seedFunction.js"
  }
}