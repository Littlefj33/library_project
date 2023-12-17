/* Form */
const createEventForm = document.getElementById("event-form");

/* Inputs */
const title = document.getElementById("title");
const dateTime = document.getElementById("date_time");
const address = document.getElementById("address");
const state = document.getElementById("state");
const zip = document.getElementById("zip");
const description = document.getElementById("description");
const attendingFee = document.getElementById("attending_fee");
const capacity = document.getElementById("capacity");
const ageLimit = document.getElementById("age_limit");

/* Array of all Inputs */
const allInputs = [
  title,
  dateTime,
  address,
  state,
  zip,
  description,
  attendingFee,
  capacity,
  ageLimit,
];

/* Error */
const errorP = document.getElementById("error");

/* Valid US States */
// prettier-ignore
const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

/* Validation Helper */
function validateInput(inputElement) {
  let isValid = true;
  let errorMessage = "";

  if (!inputElement.value.trim()) {
    errorMessage = `${inputElement.id} Input required`;
    isValid = false;
  } else {
    const inputValue = inputElement.value.trim();

    /* Validate case by case */
    switch (inputElement.id) {
      case "title": {
        if (inputValue.length < 5) {
          errorMessage = "Event title should be at least 5 characters!";
          isValid = false;
        }
        break;
      }

      case "date_time": {
        /* Ensure date and time is at least 30 minutes later than current time */
        const eventDate = new Date(inputValue);
        const curDate = new Date();
        if (isNaN(eventDate.getTime())) {
          errorMessage = "Please input valid date!";
          isValid = false;
        } else {
          const minutesAfter =
            (eventDate.getTime() - curDate.getTime()) / 1000 / 60;
          if (minutesAfter <= 30) {
            errorMessage =
              "Event start time must be at least 30 minutes in the future.";
            isValid = false;
          }
        }
        break;
      }

      case "address": {
        if (inputValue.length < 3) {
          errorMessage = "Address of location should be at least 3 character!";
          isValid = false;
        }
        break;
      }

      case "state": {
        if (!validStates.includes(inputValue)) {
          errorMessage = "Invalid state input.";
          isValid = false;
        }
        break;
      }

      case "zip": {
        if (!/^\d{5}$/.test(inputValue)) {
          errorMessage = "Please enter a valid 5-digit zip code.";
          isValid = false;
        }
        break;
      }

      case "description": {
        if (inputValue.length < 25) {
          errorMessage = "Event description should be at least 25 character!";
          isValid = false;
        }
        break;
      }

      case "attending_fee": {
        if (!/^\d+(\.\d{1,2})?$/.test(inputValue) || Number(inputValue) < 0) {
          errorMessage =
            "Attending fee must be a non-negative number with at most 2 decimal places.";
          isValid = false;
        }
        break;
      }

      case "capacity": {
        if (!/^\d+$/.test(inputValue) || Number(inputValue) < 1) {
          errorMessage = "Capacity must be a positive integer.";
          isValid = false;
        }
        break;
      }

      case "age_limit": {
        if (!/^\d+$/.test(inputValue) || Number(inputValue) <= 5) {
          errorMessage = "Age limit must be an integer greater than 5.";
          isValid = false;
        }
        break;
      }
    }
  }

  /* Update error message */
  errorP.innerHTML = errorMessage;
  return isValid;
}

/* Submit Functionality */
if (createEventForm) {
  createEventForm.addEventListener("submit", function (event) {
    let isFormValid = false;
    let badInput;

    try {
      for (let input of allInputs) {
        isFormValid = validateInput(input);
        if (!isFormValid) {
          badInput = input;
          throw "Invalid Form";
        }
      }
    } catch (e) {
      if (!isFormValid) {
        event.preventDefault();
        errorP.hidden = false;
        badInput.focus();
      } else {
        errorP.hidden = true;
      }
    }
  });
}
