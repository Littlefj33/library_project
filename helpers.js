//You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.

import { validate } from "email-validator";
import { ObjectId } from "mongodb";
import { users } from "./config/mongoCollections.js";

export const validatePassword = (password) => {
  password = password.trim();
  if (typeof password !== "string" || password.length < 8) {
    throw new Error(
      "validatePass: Password must be a valid string and at least 8 characters long."
    );
  }

  // Check for spaces
  if (/\s/.test(password)) {
    throw new Error("validatePass: Password must not contain spaces.");
  }

  // Check for at least one uppercase character
  if (!/[A-Z]/.test(password)) {
    throw new Error(
      "validatePass: Password must contain at least one uppercase character."
    );
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    throw new Error("validatePass: Password must contain at least one number.");
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+/.test(password)) {
    throw new Error(
      "validatePass: Password must contain at least one special character."
    );
  }

  return password;
};

export const validateInput = (
  firstName,
  lastName,
  dateOfBirth,
  phoneNumber,
  emailAddress,
  password,
  role
) => {
  if (!firstName || !lastName || !emailAddress || !password || !role) {
    throw new Error(
      "users: All fields must be provided! <firstName, lastName, emailAddress, passwords, role>."
    );
  }
  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    typeof emailAddress !== "string" ||
    typeof role !== "string"
  ) {
    throw new Error(
      "users: The following fields must be string! <firstName, lastName, emailAddress, role>."
    );
  }
  firstName = firstName.trim();
  lastName = lastName.trim();
  if (
    firstName.length < 2 ||
    lastName.length < 2 ||
    firstName.length > 25 ||
    lastName.length > 25
  ) {
    throw new Error(
      "users: The last name and first name must be in between 2 and 25 characters (inclusively)."
    );
  }
  if (new Date() <= new Date(dateOfBirth)) {
    throw new Error(
      "users: The date of birth cannot be the current day or future time!"
    );
  }
  phoneNumber = phoneNumber.trim();
  if (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phoneNumber)) {
    throw new Error("users: Phone number does not have a valid input!");
  }
  try {
    password = validatePassword(password);
  } catch (e) {
    throw new Error(e.message);
  }
  role = role.trim().toLowerCase();
  if (role !== "admin" && role !== "user") {
    throw new Error("users: role mismatched! should be <user or admin>");
  }
  emailAddress = emailAddress.trim().toLowerCase();
  if (!validate(emailAddress)) {
    throw new Error("users: emailAddress is not valid!");
  }
  return {
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    emailAddress,
    password,
    role,
  };
};

export const truncate = (content) => {
  if (!content || typeof content !== "string" || content.trim().length === 0) {
    throw new Error("truncate: content is not a valid string");
  }
  if (content.length <= 25) {
    return content;
  } else {
    return content.slice(0, 25);
  }
};

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
