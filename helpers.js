import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";
import axios from 'axios';
import { books } from "./config/mongoCollections.js"
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

export function checkEmpty(infoObject) {
  let emptyArray = []
  for (let [name, value] of Object.entries(infoObject)) {
      if (value == null) {
          emptyArray.push(name)
      }
  }
  if(emptyArray.length > 0) {
      throw new Error(`There are some empty fields need to be filled: [${emptyArray.join(', ')}]`)
  }
}

export function checkValidString(str, name="") {
  if (typeof str !== 'string' || str.trim() === '') {
      throw new Error(`Input ${name} is not a string or it is empty!`);
  }
  return str.trim();
}

export function checkValidDateTime(str) {
  let eventDate = new Date(str);
  let now = new Date()
  if(isNaN(eventDate.getTime())) {
    throw new Error('The date and time is invalid!')
  }
  let diff = eventDate.getTime() - now.getTime();
  if(diff/ 60 / 1000 <= 30) {
    throw new Error(`Event start time must be at least 30 minutes in the future.`)
  }
  return eventDate
} 

export function checkValidNumber(str) {
  var num = Number(str)
  if (!isNaN(num)) {
      return num
  } else {
    return null
  }
}

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