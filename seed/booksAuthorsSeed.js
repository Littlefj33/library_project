import axios from "axios";
import { books, authors } from "../config/mongoCollections.js";

export async function booksAuthorsSeed() {
  //Caution! This function will drop the books database first
  //Set the seed books file from the json given in lab5
  let rawBooksRes = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/3381b3ba73c249bfcab1e44d836acb48/raw/e14678cd750a4c4a93614a33a840607dd83fdacc/books.json"
  );
  let rawAuthorsRes = await axios.get(
    "https://gist.githubusercontent.com/graffixnyc/a086a55e04f25e538b5d52a095fe4467/raw/e9f835e9a5439a647a24fa272fcb8f5a2b94dece/authors.json"
  );
  let rawBooksData = rawBooksRes.data;
  let rawAuthorsData = rawAuthorsRes.data;
  let booksData = rawBooksData.map((book) => {
    let author = rawAuthorsData.find((author) => author.id === book.authorId);
    let authorName = author.first_name + " " + author.last_name;
    book.authorId;
    return {
      title: book.title,
      authors: [authorName],
      publication_date: new Date(book.publicationDate),
      summary: book.summary,
      language: book.language,
      genres: book.genres,
      page_count: book.pageCount,
      isbn: book.isbn,
      //Not sure what is exact staues, filled Good
      condition_status: "Good",
      liability_cost: book.price,
      //Default stock set 2
      total_stock: 2,
      current_stock: 2,
      current_borrowers: [],
      reviews: [],
      comments: [],
      former_id: book.id,
    };
  });
  const booksCollection = await books();
  await booksCollection.drop();
  const bookResult = await booksCollection.insertMany(booksData);
  //Caution! This function will drop the authors database first
  //Set the seed authors file from the json given in lab5
  let authorsPromise = rawAuthorsData.map(async (author) => {
    //Get the books id by find the former id
    let booksIdPromise = author.books.map(async (former_id) => {
      let book = await booksCollection.findOne({ former_id: former_id });
      return book._id;
    });
    let booksId = await Promise.all(booksIdPromise);
    return {
      first_name: author.first_name,
      last_name: author.last_name,
      birth_date: new Date(author.date_of_birth),
      hometown: author.HometownCity,
      books: booksId,
    };
  });
  let authorsData = await Promise.all(authorsPromise);
  const authorsCollection = await authors();
  //Drop the database before insert

  await authorsCollection.drop();
  const authorResult = await authorsCollection.insertMany(authorsData);
  // Remove book former_id field
  await booksCollection.updateMany({}, { $unset: { former_id: "" } });
  //Retrun the msg about the insert

  return { book: bookResult, author: authorResult };
}
