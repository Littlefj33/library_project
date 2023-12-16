(function () {
  // List of valid US states for validation
  const validStates = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Select the form
  const createEventForm = document.querySelector(".event-form");

  // Form fields
  const title = document.getElementById("title");
  const dateTime = document.getElementById("date_time");
  const address = document.getElementById("address");
  const state = document.getElementById("state");
  const zip = document.getElementById("zip");
  const description = document.getElementById("description");
  const attendingFee = document.getElementById("attending_fee");
  const capacity = document.getElementById("capacity");
  const ageLimit = document.getElementById("age_limit");

  // Validation function
  function validateInput(inputElement) {
    let isValid = true;
    let errorMessage = '';
    // errorElement = inputElement.nextElementSibling.nextElementSibling
    errorElement = inputElement.nextElementSibling

    // Check for empty input
    if (!inputElement.value.trim()) {
      errorMessage = 'Input required';
      isValid = false;
    } else {
      let inputValue = inputElement.value.trim();
      // Check error case by case
      switch (inputElement.id) {
        case 'title':
          if (inputValue.length < 5) {
            errorMessage = "Event title should be at least 5 character!";
            isValid = false;
          }
          break;
        case 'date_time':
          // Ensure date and time is at least 30 minutes later
          let eventDate = new Date(inputValue)
          let now = new Date()
          if(isNaN(eventDate.getTime())) {
            errorMessage = 'Please input valid date!'
            isValid = false;
          } else {
            let minutesAfter = (eventDate.getTime() - now.getTime()) / 1000 / 60;
            if (minutesAfter <= 30) {
            errorMessage = 'Event start time must be at least 30 minutes in the future.';
            isValid = false;
            }
          }
          break;
        case 'address':
          if (inputValue.length < 3) {
            errorMessage = 'Address of location should be at least 3 character!';
            isValid = false;
          }
          break;
        case 'state':
          if (!validStates.includes(inputValue)) {
            errorMessage = 'Invalid state input.';
            isValid = false;
          }
          break;
        case 'zip':
          if (!/^\d{5}$/.test(inputValue)) {
            errorMessage = 'Please enter a valid 5-digit zip code.';
            isValid = false;
          }
          break;
        case 'description':
          if (inputValue.length < 25) {
            errorMessage = 'Event description should be at least 25 character!';
            isValid = false;
          }
          break;
        case 'attending_fee':
          if (!/^\d+(\.\d{1,2})?$/.test(inputValue) || Number(inputValue) < 0) {
            errorMessage = 'Attending fee must be a non-negative number with at most 2 decimal places.';
            isValid = false;
          }
          break;

        case 'capacity':
          if (!/^\d+$/.test(inputValue) || Number(inputValue) < 1) {
            errorMessage = 'Capacity must be a positive integer.';
            isValid = false;
          }
          break;

        case 'age_limit':
          if (!/^\d+$/.test(inputValue) || Number(inputValue) <= 5) {
            errorMessage = 'Age limit must be an integer greater than 5.';
            isValid = false;
          }
          break;

      }
    }

    // Update error message
    errorElement.textContent = errorMessage;
    return isValid;
  }

  // Attach event listeners to each input for real-time validation
  [title, dateTime, address, state, zip, description, attendingFee, capacity, ageLimit].forEach(input => {
    input.addEventListener('input', () => validateInput(input));
  });

  // Form submission event
  createEventForm.addEventListener('submit', function (event) {
    let isFormValid = true;

    // Validate each input field
    [title, dateTime, address, state, zip, description, attendingFee, capacity, ageLimit].forEach(input => {
      isFormValid = validateInput(input) && isFormValid;
    });
    if (!isFormValid) {
      event.preventDefault();
    }
  });
})();
