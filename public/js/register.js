/* Client-side validation for registration page */

/* Form */
const registerForm = document.getElementById("registration-form");

/* Inputs */
const firstNameInput = document.getElementById("firstNameInput");
const lastNameInput = document.getElementById("lastNameInput");
const dateOfBirthInput = document.getElementById("dobInput");
const phoneNumberInput = document.getElementById("phoneNumberInput");
const emailInput = document.getElementById("emailAddressInput");
const passwordInput = document.getElementById("passwordInput");
const confirmPasswordInput = document.getElementById("confirmPasswordInput");
const roleInput = document.getElementById("roleInput");

/* Error */
const errorP = document.getElementById("error");

/* Form Functionality */
if (registerForm) {
  registerForm.addEventListener("submit", (event) => {
    if (
      firstNameInput.value.trim() &&
      lastNameInput.value.trim() &&
      dateOfBirthInput.value.trim() &&
      phoneNumberInput.value.trim() &&
      emailInput.value.trim() &&
      passwordInput.value.trim() &&
      confirmPasswordInput.value.trim() &&
      roleInput.value.trim()
    ) {
      try {
        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const dateOfBirth = dateOfBirthInput.value.trim();
        const phoneNumber = phoneNumberInput.value.trim();
        const emailAddress = emailInput.value.toLowerCase().trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
        const role = roleInput.value.toLowerCase().trim();

        const containsNumRegex = /([0-9])/;
        const containsCapLetRegex = /([A-Z])/;
        /* List of all special characters found from OWASP: https://owasp.org/www-community/password-special-characters */
        const containsSpecialRegex = /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/;
        const containsWhitespaceRegex = /(\s)/;

        /* Email address regex found from Stack Overflow: https://stackoverflow.com/questions/46155/how-can-i-validate-an-email-address-in-javascript */
        const validEmailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (firstName.length < 2 || firstName.length > 25)
          throw "ERROR: First name must contain between 2 and 25 characters & cannot be empty";
        if (containsNumRegex.test(firstName))
          throw "ERROR: First name cannot contain numbers";

        if (lastName.length < 2 || lastName.length > 25)
          throw "ERROR: Last name must contain between 2 and 25 characters & cannot be empty";
        if (containsNumRegex.test(lastName))
          throw "ERROR: Last name cannot contain numbers";

        let DOB;
        try {
          DOB = new Date(dateOfBirth);
        } catch (e) {
          throw "ERROR: Invalid date input";
        }
        if (new Date() <= DOB)
          throw "ERROR: Date of birth cannot be the current day or future time";

        if (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phoneNumber))
          throw "ERROR: Invalid phone number";

        if (!validEmailRegex.test(emailAddress))
          throw "ERROR: Invalid email address";

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

        if (password !== confirmPassword)
          throw "ERROR: Password and confirmation does not match";

        if (!(role === "admin" || role === "user"))
          throw "ERROR: Role must be admin or user";

        errorP.hidden = true;
        firstNameInput.focus();
      } catch (e) {
        event.preventDefault();
        errorP.innerHTML = e;
        errorP.hidden = false;
      }
    } else {
      event.preventDefault();
      if (!firstNameInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing first name input";
        firstNameInput.focus();
      } else if (!lastNameInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing last name input";
        lastNameInput.focus();
      } else if (!dateOfBirthInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing date of birth input";
        dateOfBirthInput.focus();
      } else if (!phoneNumberInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing phone number input";
        phoneNumberInput.focus();
      } else if (!emailInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing email input";
        emailInput.focus();
      } else if (!passwordInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing password input";
        passwordInput.focus();
      } else if (!confirmPasswordInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing password confirmation input";
        confirmPasswordInput.focus();
      } else {
        errorP.innerHTML = "ERROR: Missing role input";
        roleInput.focus();
      }
      errorP.hidden = false;
    }
  });
}
