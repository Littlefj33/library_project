import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";

export const registerUser = async (
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber,
  emailAddress,
  password,
  role
) => {
  if (
    firstName === undefined ||
    lastName === undefined ||
    dateOfBirth === undefined ||
    phoneNumber === undefined ||
    emailAddress === undefined ||
    password === undefined ||
    role === undefined
  )
    throw "ERROR: Need all inputs";

  const containsNumRegex = /([0-9])/;
  const containsCapLetRegex = /([A-Z])/;
  /* List of all special characters found from OWASP: https://owasp.org/www-community/password-special-characters */
  const containsSpecialRegex = /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/;
  const containsWhitespaceRegex = /(\s)/;

  /* Email address regex found from Stack Overflow: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript */
  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  /* First Name */
  if (typeof firstName !== "string")
    throw "ERROR: First name must be of type String";
  firstName = firstName.trim();
  if (firstName.length < 2 || firstName.length > 25)
    throw "ERROR: First name must contain between 2 and 25 characters & cannot be empty";
  if (containsNumRegex.test(firstName))
    throw "ERROR: First name cannot contain numbers";

  /* Last Name */
  if (typeof lastName !== "string")
    throw "ERROR: Last name must be of type String";
  lastName = lastName.trim();
  if (lastName.length < 2 || lastName.length > 25)
    throw "ERROR: Last name must contain between 2 and 25 characters & cannot be empty";
  if (containsNumRegex.test(lastName))
    throw "ERROR: Last name cannot contain numbers";

  /* Date of Birth */
  if (typeof dateOfBirth !== "string")
    throw "ERROR: Date of Birth must be of type String";
  dateOfBirth = dateOfBirth.trim();
  let DOB;
  try {
    DOB = new Date(dateOfBirth);
  } catch (e) {
    throw "ERROR: Invalid date input";
  }
  if (new Date() <= DOB)
    throw "ERROR: Date of birth cannot be the current day or future time";

  /* Phone Number */
  if (typeof phoneNumber !== "string")
    throw "ERROR: Phone number must be of type String";
  phoneNumber = phoneNumber.trim();
  if (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phoneNumber))
    throw "ERROR: Phone number does not have a valid input";

  /* Email Address */
  if (typeof emailAddress !== "string")
    throw "ERROR: Email address must be of type String";
  emailAddress = emailAddress.toLowerCase().trim();
  if (!validEmailRegex.test(emailAddress)) throw "ERROR: Invalid email address";

  const userCollection = await users();
  let userList = await userCollection
    .find({}, { projection: { _id: 0, emailAddress: 1 } })
    .toArray();
  if (!userList) throw "ERROR: Could not get all users";
  for (let elem of userList) {
    if (emailAddress.toLowerCase() === elem.emailAddress.toLowerCase())
      throw "ERROR: Email address already exists in the database";
  }

  /* Password */
  if (typeof password !== "string")
    throw "ERROR: Password must be of type String";
  password = password.trim();
  if (password.length < 8)
    throw "ERROR: Password must contain at least 8 characters & cannot be empty";
  if (
    !(
      containsNumRegex.test(password) &&
      containsCapLetRegex.test(password) &&
      containsSpecialRegex.test(password)
    )
  )
    throw "ERROR: Password must contain at least one uppercase letter, one number, and one special character";
  if (containsWhitespaceRegex.test(password))
    throw "ERROR: Password cannot contain whitespace";

  /* Role */
  if (typeof role !== "string") throw "ERROR: Role must be of type String";
  role = role.toLowerCase().trim();
  if (!(role === "admin" || role === "user"))
    throw "ERROR: Role must be admin or user";

  /* Hash Password & Insert User */
  const saltRounds = 16;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUserInfo = {
    firstName,
    lastName,
    dateOfBirth: DOB,
    phoneNumber,
    emailAddress,
    password: passwordHash,
    date_joined: new Date(),
    role,
    blogs_created: [],
    events_joined: [],
    return_requests: [],
    favorite_books: [],
    current_checked_out_books: [],
    checked_out_books: [],
  };
  const insertUser = await userCollection.insertOne(newUserInfo);
  if (!insertUser.acknowledged || !insertUser.insertedId)
    throw "ERROR: Could not add user to collection";

  return { insertedUser: true };
};

export const loginUser = async (emailAddress, password) => {
  if (emailAddress === undefined || password === undefined)
    throw "ERROR: Need all inputs";

  const validEmailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (typeof emailAddress !== "string")
    throw "ERROR: Email address must be of type String";
  emailAddress = emailAddress.toLowerCase().trim();
  if (!validEmailRegex.test(emailAddress)) throw "ERROR: Invalid email address";

  const containsNumRegex = /([0-9])/;
  const containsCapLetRegex = /([A-Z])/;
  const containsSpecialRegex = /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/;
  const containsWhitespaceRegex = /(\s)/;

  if (typeof password !== "string")
    throw "ERROR: Password must be of type String";
  password = password.trim();
  if (password.length < 8)
    throw "ERROR: Password must contain at least 8 characters & cannot be empty";
  if (
    !(
      containsNumRegex.test(password) &&
      containsCapLetRegex.test(password) &&
      containsSpecialRegex.test(password)
    )
  )
    throw "ERROR: Password must contain at least one uppercase letter, one number, and one special character";
  if (containsWhitespaceRegex.test(password))
    throw "ERROR: Password cannot contain whitespace";

  const userCollection = await users();
  let userList = await userCollection
    .find(
      {},
      {
        projection: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          emailAddress: 1,
          password: 1,
          role: 1,
        },
      }
    )
    .toArray();
  if (!userList) throw "ERROR: Could not get all users";

  let passwordsMatch = false;
  let foundPasswordHash = "";
  let foundUser = {};

  for (let elem of userList) {
    if (emailAddress.toLowerCase() === elem.emailAddress.toLowerCase()) {
      foundPasswordHash = elem.password;
      foundUser = elem;
    }
  }

  if (foundPasswordHash === "")
    throw "Either the email address or password is invalid";

  try {
    passwordsMatch = await bcrypt.compare(password, foundPasswordHash);
  } catch (e) {
    throw "ERROR: Problem with matching credentials";
  }

  if (passwordsMatch) {
    return {
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      emailAddress: foundUser.emailAddress,
      role: foundUser.role,
    };
  } else {
    throw `Either the email address or password is invalid`;
  }
};
