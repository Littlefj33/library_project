(function () {
    // Add any forms here
    const loginForm = document.querySelector("#login-form")
    const registrationForm = document.querySelector("#registration-form")

    // Add the form attributes here with their ids
    const email = document.getElementById("emailAddressInput");
    const password = document.getElementById("passwordInput");
    const firstName = document.getElementById("firstNameInput");
    const lastName = document.getElementById("lastNameInput");
    const dateOfBirth = document.getElementById("dobInput")
    const phoneNumber = document.getElementById("phoneNumberInput")
    const confirmPassword = document.getElementById("confirmPasswordInput")


    // Add the form attributes here with their #'id' + 'span.error'.
    // Make sure the the attribute you are adding has span tag in the handlebar
    const emailError = document.querySelector("#emailAddressInput + span.error");
    const passwordError = document.querySelector("#passwordInput + span.error");
    const firstNameError = document.querySelector("#firstNameInput + span.error");
    const lastNameError = document.querySelector("#lastNameInput + span.error");
    const dateOfBirthError = document.querySelector("#dobInput + span.error");
    const phoneNumberError = document.querySelector("#phoneNumberInput + span.error");
    const confirmPasswordError = document.querySelector("#confirmPasswordInput + span.error")


    if (loginForm) {

        email.addEventListener("input", () => validateInput(email, emailError));
        password.addEventListener("input", () => validateInput(password, passwordError));

        loginForm.addEventListener("submit", (event) => {
            const isEmailValid = validateInput(email, emailError);
            const isPasswordValid = validateInput(password, passwordError);
            if (!isEmailValid || !isPasswordValid) {
                event.preventDefault();
            }
        })
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
                if (!/^[A-Za-z\s]+$/.test(inputElement.value) || inputElement.value.length < 2 || inputElement.value.length > 25) {
                    errorElement.textContent = "Name must be 2-25 characters long and cannot contain numbers or special characters.";
                    errorElement.className = "error active";
                    return false;
                }
                break;
            case 'emailAddressInput':
                if (!inputElement.validity.valid) {
                    errorElement.textContent = "Please enter a valid email address.";
                    errorElement.className = "error active";
                    return false;
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

        }
        errorElement.textContent = "";
        errorElement.className = "error";
        return true;
    }
})()
