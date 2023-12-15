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

export function checkValidString(str, name="information") {
  if (typeof str !== 'string' || str.trim() === '') {
      throw new Error(`Input ${name} is not a string or it is empty!`)
  }
  return str.trim();
}

export function checkValidDateTime(str) {
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}, (0[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/

  if (!dateRegex.test(str)) {
    throw new Error(`Invalid date input, should be mm/dd/yyyy, :'${str}'`);
  }
  const splitDateTime = str.split(",")
  const datePart = splitDateTime[0].trim()
  const timePart = splitDateTime[1].trim()
  const dateArr = datePart.split("/")
  const dateNum = dateArr.map(str => parseInt(str))
  const daysInMonths = {
      '01': 31,
      '02': 28,
      '03': 31,
      '04': 30,
      '05': 31,
      '06': 30,
      '07': 31,
      '08': 31,
      '09': 30,
      '10': 31,
      '11': 30,
      '12': 31
  }
  const monthNames = {
      '01': 'January',
      '02': 'February',
      '03': 'March',
      '04': 'April',
      '05': 'May',
      '06': 'June',
      '07': 'July',
      '08': 'August',
      '09': 'September',
      '10': 'October',
      '11': 'November',
      '12': 'December'
  }
  if (dateArr[2] / 4 === 0) { // year
      daysInMonths['02'] = 29;
  }
  if (dateNum[1] > daysInMonths[dateArr[0]]) { 
      throw new Error(`There is no ${dateArr[1]} day in the month of ${monthNames[dateArr[0]]} in the year ${dateArr[2]}.`)
  }
  let diff = Date(str) - Date();
  if(diff/ 60 / 1000 <= 30) {
    throw new Error(`Event start time must be at least 30 minutes in the future.`)
  }
  return Date(str)

} 

export function checkValidNumber(str) {
  var num = Number(str)
  if (!isNaN(num)) {
      return num
  } else {
    return null
  }
}