(function () {
  //global vars
  const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Add any forms here
  const loginForm = document.querySelector("#login-form")
  const registrationForm = document.querySelector("#registration-form")
  const createEventForm = document.querySelector("#event-form")

  // Add the form attributes here with their ids
  const email = document.getElementById("emailAddressInput");
  const password = document.getElementById("passwordInput");
  const firstName = document.getElementById("firstNameInput");
  const lastName = document.getElementById("lastNameInput");
  const dateOfBirth = document.getElementById("dobInput")
  const phoneNumber = document.getElementById("phoneNumberInput")
  const confirmPassword = document.getElementById("confirmPasswordInput")
  const title = document.getElementById("title");
  const dateTime = document.getElementById("date_time");
  const address = document.getElementById("address");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");
  const description = document.getElementById("description");
  const attendingFee = document.getElementById("attending_fee");
  const capacity = document.getElementById("capacity");
  const ageLimit = document.getElementById("age_limit");

  // Add the form attributes here with their #'id' + 'span.error'.
  // Make sure the the attribute you are adding has span tag in the handlebar
  const emailError = document.querySelector("#emailAddressInput + span.error");
  const passwordError = document.querySelector("#passwordInput + span.error");
  const firstNameError = document.querySelector("#firstNameInput + span.error");
  const lastNameError = document.querySelector("#lastNameInput + span.error");
  const dateOfBirthError = document.querySelector("#dobInput + span.error");
  const phoneNumberError = document.querySelector("#phoneNumberInput + span.error");
  const confirmPasswordError = document.querySelector("#confirmPasswordInput + span.error")
  const titleError = document.getElementById("#title + span.error");
  const dateTimeError = document.getElementById("#date_time + span.error");
  const addressError = document.getElementById("#address + span.error");
  const stateError = document.getElementById("#state + span.error");
  const zipError = document.getElementById("#zip + span.error");
  const descriptionError = document.getElementById("#description + span.error");
  const attendingFeeError = document.getElementById("#attending_fee + span.error");
  const capacityError = document.getElementById("#capacity + span.error");
  const ageLimitError = document.getElementById("#age_limit + span.error");

  if (createEventForm) {
    title.addEventListener("input", () => validateInput(title, titleError));
    dateTime.addEventListener("input", () => validateInput(dateTime, dateTimeError));
    address.addEventListener("input", () => validateInput(address, addressError));
    state.addEventListener("input", () => validateInput(state, stateError));
    zip.addEventListener("input", () => validateInput(zip, zipError));
    description.addEventListener("input", () => validateInput(description, descriptionError));
    attendingFee.addEventListener("input", () => validateInput(attendingFee, attendingFeeError));
    capacity.addEventListener("input", () => validateInput(capacity, capacityError));
    ageLimit.addEventListener("input", () => validateInput(ageLimit, ageLimitError));

    createEventForm.addEventListener("submit", (event) => {
      // Perform validation on form submission
      const isTitleValid = validateInput(title, titleError);
      const isDateTimeValid = validateInput(dateTime, dateTimeError);
      const isAddressValid = validateInput(address, addressError);
      const isStateValid = validateInput(state, stateError);
      const isZipValid = validateInput(zip, zipError);
      const isDescriptionValid = validateInput(description, descriptionError);
      const isAttendingFeeValid = validateInput(attendingFee, attendingFeeError);
      const isCapacityValid = validateInput(capacity, capacityError);
      const isAgeLimitValid = validateInput(ageLimit, ageLimitError);

      // Prevent form submission if any validation fails
      if (!isTitleValid || !isDateTimeValid || !isAddressValid || !isStateValid ||
        !isZipValid || !isDescriptionValid || !isAttendingFeeValid ||
        !isCapacityValid || !isAgeLimitValid) {
        event.preventDefault();
      }
    })

  }

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

    if (registrationForm) {
      email.addEventListener("input", () => validateInput(email, emailError));
      password.addEventListener("input", () => validateInput(password, passwordError));
      firstName.addEventListener("input", () => validateInput(firstName, firstNameError));
      lastName.addEventListener("input", () => validateInput(lastName, lastNameError));
      dateOfBirth.addEventListener("input", () => validateInput(dateOfBirth, dateOfBirthError));
      phoneNumber.addEventListener("input", () => validateInput(phoneNumber, phoneNumberError));
      confirmPassword.addEventListener("input", () => validateInput(confirmPassword, confirmPasswordError));

      registrationForm.addEventListener("submit", (event) => {
        const isEmailValid = validateInput(email, emailError);
        const isPasswordValid = validateInput(password, passwordError);
        const isFirstNameValid = validateInput(firstName, firstNameError);
        const isLastNameValid = validateInput(lastName, lastNameError);
        const isDobValid = validateInput(dateOfBirth, dateOfBirthError);

        if (isEmailValid || isPasswordValid || isFirstNameValid || isLastNameValid || isDobValid) {
          event.preventDefault();
        }
      })
    }

    const validateInput = (inputElement, errorElement) => {
      if (!inputElement.value.trim()) { // This applies to all the forms, so you don't have to worry about empty input checking
        errorElement.textContent = "This field is required.";
        errorElement.className = "error active";
        return false;
      }
      switch (inputElement.id) { // casses for all the different ids
        case 'firstNameInput':
        case 'lastNameInput':
        case 'title':
          inputElement.value = inputElement.value.trim()
          if (!/^[A-Za-z\s]+$/.test(inputElement.value) || inputElement.value.length < 2 || inputElement.value.length > 25) {
            errorElement.textContent = "Name must be 2-25 characters long and cannot contain numbers or special characters.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case 'emailAddressInput':
          inputElement.value = inputElement.value.trim()
          if (!inputElement.validity.valid) {
            errorElement.textContent = "Please enter a valid email address.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case 'dobInput':
          if (new Date(inputElement.value) > new Date()) {
            errorElement.textContent = "Cannot put a future or today's date!"
            errorElement.className = "error active";
          }
          break;
        case "phoneNumberInput":
          inputElement.value = inputElement.value.trim()
          if (!/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(inputElement.value)) {
            errorElement.textContent = "Invalid Phone Number format!"
            errorElement.className = "error active";
          }
          break;
        case 'passwordInput':
          if (inputElement.value.length < 8 || !/[A-Z]/.test(inputElement.value) || !/\d/.test(inputElement.value) || !/\W/.test(inputElement.value)) {
            errorElement.textContent = "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case 'confirmPasswordInput':
          if (inputElement.value !== document.getElementById('passwordInput').value) {
            errorElement.textContent = "Passwords do not match.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case "date_time":
          // Check if the input date and time is in the future
          if (new Date(inputElement.value) <= new Date()) {
            errorElement.textContent = "Please select a future date and time.";
            errorElement.className = "error active";
            return false;
          }
          if (new Date(inputElement.value).getFullYear() > (new Date()).getFullYear() + 5) {
            errorElement.textContent = "Please select a date within the next 5 years.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case "address":
          inputElement.value = inputElement.value.trim()
          if (!/^[a-zA-Z0-9\s,.'-]{5,100}$/.test(inputElement.value)) {
            errorElement.textContent = "Address contains invalid characters.";
            errorElement.className = "error active";
            return false;
          }
          break;
        case "state":
          inputElement.value = inputElement.value.trim()
          if (!/^[A-Z]{2}$/.test(inputElement.value.toUpperCase()) || !validStates.includes(inputElement.value.toUpperCase())) {
            errorElement.textContent = "Please enter a valid 2-letter state code (e.g., NY).";
            errorElement.className = "error active";
            return false;
          }
          break;
        case "zip":
          inputElement.value = inputElement.value.trim()
          if (!/^\d{5}$/.test(inputElement.value)) {
            errorElement.textContent = "Please enter a valid zip-code.";
            errorElement.className = "error active";
            return false;
          }
          break;
      }
      errorElement.textContent = "";
      errorElement.className = "error";
      return true;
    }

    errorElement.textContent = "";
    errorElement.className = "error";
    return true;
  };
})();
