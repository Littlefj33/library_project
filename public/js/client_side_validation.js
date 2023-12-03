(function () {
  // Add any forms here
  const loginForm = document.querySelector("#login-form");

  // Add the form attributes here with their ids
  const email = document.getElementById("emailAddressInput");
  const password = document.getElementById("passwordInput");

  // Add the form attributes here with their #'id' + 'span.error'.
  // Make sure the the attribute you are adding has span tag in the handlebar
  const emailError = document.querySelector("#emailAddressInput + span.error");
  const passwordError = document.querySelector("#passwordInput + span.error");

  if (loginForm) {
    email.addEventListener("input", () => validateInput(email, emailError));
    password.addEventListener("input", () =>
      validateInput(password, passwordError),
    );

    loginForm.addEventListener("submit", (event) => {
      const isEmailValid = validateInput(email, emailError);
      const isPasswordValid = validateInput(password, passwordError);
      if (!isEmailValid || !isPasswordValid) {
        event.preventDefault();
      }
    });
  }

  const validateInput = (inputElement, errorElement) => {
    if (!inputElement.value.trim()) {
      // This applies to all the forms, so you don't have to worry about empty input checking
      errorElement.textContent = "This field is required.";
      errorElement.className = "error active";
      return false;
    }

    switch (
      inputElement.id // casses for all the different ids
    ) {
      case "emailAddressInput":
        if (!inputElement.validity.valid) {
          errorElement.textContent = "Please enter a valid email address.";
          errorElement.className = "error active";
          return false;
        }
        break;
      case "passwordInput":
        if (
          inputElement.value.length < 8 ||
          !/[A-Z]/.test(inputElement.value) ||
          !/\d/.test(inputElement.value) ||
          !/\W/.test(inputElement.value)
        ) {
          errorElement.textContent =
            "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
          errorElement.className = "error active";
          return false;
        }
        break;
    }

    errorElement.textContent = "";
    errorElement.className = "error";
    return true;
  };
})();
