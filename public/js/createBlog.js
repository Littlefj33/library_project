/* Client-side validation for create blog page */

/* Form */
const createBlogForm = document.getElementById("blog-form");

/* Inputs */
const blogTitleInput = document.getElementById("blogTitle");
const contentInput = document.getElementById("content");

/* Error */
const errorP = document.getElementById("error");

/* Form Functionality */
if (createBlogForm) {
  createBlogForm.addEventListener("submit", (event) => {
    if (blogTitleInput.value.trim() && contentInput.value.trim()) {
      try {
        const blogTitle = blogTitleInput.value.trim();
        const content = contentInput.value.trim();

        if (blogTitle.length < 5)
          throw "ERROR: Blog title must contain at least 5 characters";

        if (content.length < 5)
          throw "ERROR: Content must contain at least 5 characters";

        errorP.hidden = true;
        blogTitleInput.focus();
      } catch (e) {
        event.preventDefault();
        errorP.innerHTML = e;
        errorP.hidden = false;
      }
    } else {
      event.preventDefault();
      if (!blogTitleInput.value.trim() && contentInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing title and content input";
        blogTitleInput.focus();
      } else if (!blogTitleInput.value.trim()) {
        errorP.innerHTML = "ERROR: Missing title input";
        blogTitleInput.focus();
      } else {
        errorP.innerHTML = "ERROR: Missing content input";
        contentInput.focus();
      }
      errorP.hidden = false;
    }
  });
}
