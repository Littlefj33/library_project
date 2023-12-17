import axios from 'axios';
import { books } from "../config/mongoCollections.js"
export async function booksSeed() {
    //Caution! This function will drop the books database first
    //Set the seed books file from the json given in lab5
      let  {data}  = await axios.get('https://gist.githubusercontent.com/graffixnyc/3381b3ba73c249bfcab1e44d836acb48/raw/e14678cd750a4c4a93614a33a840607dd83fdacc/books.json');
      data = data.map(book => {
        return {
          title: book.title,
          //For authors as the json file author is only one person with id but not name
          //Add some fake authors
          authors: ['Some Author1', 'Some Author2'],
          publication_date: new Date(book.publicationDate),
          summary: book.summary,
          language: book.language,
          genres: book.genres,
          page_count: book.pageCount,
          isbn: book.isbn,
          //Not sure what is exact staues, filled Good
          condition_status: 'Good', 
          liability_cost: book.price, 
          //Default stock set 2
          total_stock: 2, 
          current_stock: 2, 
          current_borrowers: [],       
          reviews: [],
          comments: []
        }
    });
    const booksCollection = await books();
    //Drop the database before insert
    await booksCollection.drop();
    const result = await booksCollection.insertMany(data);
    //Retrun the msg about the insert
    return result
  }