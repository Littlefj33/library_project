import {events} from '../config/mongoCollections.js'
import * as helpers from '../helpers.js'
export const create = async (
  organizer_id,
  title, 
  date_time,
  address, 
  state, 
  zip,
  description, 
  attending_fee,
  capacity,
  age_limit
) => {

  const eventInfo = {
      organizer_id,
      title, 
      date_time,
      address, 
      state, 
      zip,
      description, 
      attending_fee,
      capacity,
      age_limit
  }
  // Empty Check
  helpers.checkEmpty(eventInfo)
  // String Check
  title = helpers.checkValidString(title, 'title')
  date_time = helpers.checkValidString(date_time, 'date and time')
  address = helpers.checkValidString(address, 'address')
  state = helpers.checkValidString(state, 'state')
  zip = helpers.checkValidString(zip, 'zip code')
  description = helpers.checkValidString(description, 'description')
  attending_fee = helpers.checkValidString(attending_fee, 'attending fee')
  age_limit = helpers.checkValidString(age_limit, 'age limit')
  capacity = helpers.checkValidString(capacity, 'capacity')
  // title more than 5 character 
  if (title.length < 5) {
    throw new Error("Event title should be at least 5 character!")
  }
  // check date_time validation
  let dateInfo = helpers.checkValidDateTime(date_time)
  // description more than 25 character
  if (description.length < 25) {
    throw new Error("Event description should be at least 25 character!")
  }
  
  // check numbers
  let capacityVal = helpers.checkValidNumber(capacity,'max capacity')
  let attending_feeVal = helpers.checkValidNumber(attending_fee,'Attending fee')
  let age_limitVal = helpers.checkValidNumber(age_limit,'Age limit')
  if (!capacityVal || capacityVal <= 0 || !Number.isInteger(capacityVal)) {
    throw new Error('Capacity should be a positive integer and the value should be greater than 0');
  }

  if (!attending_feeVal || attending_feeVal < 0 || !Number.isInteger(attending_feeVal * 100)) {
    throw new Error('Attending fee should be a integer, a positive float with 2 decimal places, or 0');
  }

  if (!age_limitVal || age_limitVal <= 5 || !Number.isInteger(age_limitVal)) {
    throw new Error('Age limit should be a integer great than 5!');
  }
  // check location
  if(address.length < 3) {
    throw new Error(`Address of location should be at least 3 character!`)
  }
  const USStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", 
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", 
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", 
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", 
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ]
  if (!USStates.includes(state)) {
    throw new Error(`Invalid state "${state}"!`);
  }
  if (!/^[0-9]{5}$/.test(zip)) {
    throw new Error(`Invalid zip code:"${zip}"!`);
  }
  let newEvent = {        
   title: title,
   organizer_id: organizer_id,     
   date_time: dateInfo,
   location: {
    address: address,
    state: state,
    zip: zip
   },
   description: description,
   attending_fee: attending_feeVal,
   capacity: capacityVal,
   age_limit: age_limitVal,
   attendees: [],
   comments: [],
   canceled: false
  }
  const eventCollection = await events()
  const insertInfo = await eventCollection.insertOne(newEvent);
  if (!insertInfo.acknowledged || !insertInfo.insertedId) {
    throw new Error('Could not add event!')
  }
  return { insertedEvent: true };      
}