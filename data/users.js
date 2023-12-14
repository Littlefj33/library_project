import { users } from "../config/mongoCollections.js"
import bcrypt from 'bcrypt';
import { validatePassword, validateInput } from "../helpers.js"
import { validate } from "email-validator"

export const registerUser = async (
    firstName,
    lastName,
    dateOfBirth,
    phoneNumber,
    emailAddress,
    password,
    role
) => {

    try {
        const validatedInput = validateInput(firstName, lastName, dateOfBirth, phoneNumber, emailAddress, password, role)
        firstName = validatedInput.firstName
        lastName = validatedInput.lastName
        dateOfBirth = validateInput.dateOfBirth
        phoneNumber = validateInput.phoneNumber
        emailAddress = validatedInput.emailAddress
        password = validatedInput.password
        role = validatedInput.role
    } catch (e) {
        throw new Error(e.message)
    }

    const usersCollection = await users()

    const emailSearch = await usersCollection.findOne({ "emailAddress": emailAddress })

    if (emailSearch !== null) { throw new Error("users: Email already used!") }

    const user = {
        firstName: firstName,
        lastName: lastName,
        dateOfBirth: new Date(dateOfBirth),
        phoneNumber: phoneNumber,
        emailAddress: emailAddress,
        password: await bcrypt.hash(password, 16),
        role: role
    }

    const insertStatus = await usersCollection.insertOne(user)
    if (insertStatus.acknowledged || insertStatus.insertedId) {
        return { insertedUser: true }
    } else {
        return { insertedUser: false }
    }
};

export const loginUser = async (emailAddress, password) => {
    emailAddress = emailAddress.trim().toLowerCase()
    password = password.trim()

    try {
        validatePassword(password)
    } catch (e) {
        throw new Error(e.message)
    }

    if (!validate(emailAddress)) {
        throw new Error("users: emailAddress is not valid!")
    }

    const usersCollection = await users()

    const emailSearch = await usersCollection.findOne({ "emailAddress": emailAddress })
    if (emailSearch === undefined) { throw new Error("Either the email address or password is invalid") }

    // console.log(emailSearch.password)

    try {
        const comparePass = await bcrypt.compare(password, emailSearch.password);
        if (!comparePass) {
            throw new Error("Either the email address or password is invalid")
        }
    } catch (e) {
        console.error(e)
        throw new Error(e.message)
    }

    // console.log(emailSearch)

    return {
        firstName: emailSearch.firstName,
        lastName: emailSearch.lastName,
        emailAddress: emailSearch.emailAddress,
        role: emailSearch.role
    }
};
