/* Client-side validation for login page */

/* Form */
const loginForm = document.getElementById("login-form");

/* Inputs */
const emailInput = document.getElementById("emailAddressInput");
const passwordInput = document.getElementById("passwordInput");

/* Error */
const errorP = document.getElementById("error");

/* Form Functionality */
if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    if (emailInput.value.trim() && passwordInput.value.trim()) {
      try {
        const emailAddress = emailInput.value.toLowerCase().trim();
        const password = passwordInput.value.trim();

        const validEmailRegex =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const containsNumRegex = /([0-9])/;
        const containsCapLetRegex = /([A-Z])/;
        /* List of all special characters found from OWASP: https://owasp.org/www-community/password-special-characters */
        const containsSpecialRegex = /([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/;
        const containsWhitespaceRegex = /(\s)/;

        if (!validEmailRegex.test(emailAddress))
          throw "ERROR: Invalid email address";

        if (password.length < 8)
          throw "ERROR: Password must contain at least 8 characters";
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

        errorP.hidden = true;
        emailInput.focus();
      } catch (e) {
        event.preventDefault();
        errorP.innerHTML = e;
        errorP.hidden = false;
      }
    } else {
      event.preventDefault();
      if (!emailInput.value.trim() && passwordInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing email & password input";
      } else if (!emailInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing email input";
      } else {
        errorP.innerHTML = "ERROR: Missing password input";
      }
      errorP.hidden = false;
      emailInput.focus();
    }
  });
}
