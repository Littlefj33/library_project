// eslint-disable-next-line no-unused-vars
function toggleForm() {
  const formElem = document.getElementById("form-popup");
  if (formElem.classList.contains("form-popup")) {
    formElem.classList.remove("form-popup");
    formElem.classList.add("show-form");
  } else if (formElem.classList.contains("show-form")) {
    formElem.classList.remove("show-form");
    formElem.classList.add("form-popup");
  }
}
