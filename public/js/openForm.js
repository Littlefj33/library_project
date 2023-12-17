// eslint-disable-next-line no-unused-vars
function toggleForm() {
  const formElem = document.getElementById("form-popup");
  if (formElem.style.display === "none") {
    formElem.style.display = "block";
  } else if (formElem.style.display === "block") {
    formElem.style.display = "none";
  }
}
