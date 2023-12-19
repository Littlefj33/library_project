$(document).ready(function () {
  const searchForm = $(".search-form");
  const booksSection = $(".books-section");
  const eventsSection = $(".events-section");
  const blogsSection = $(".blogs-section");

  const bookDetails = $(".reviews-section");
  const eventDetails = $(".attendees-count");

  const errorElement = $(".alert");
  const formErrorElement = $(".formAlert");

  let page = "";
  if (booksSection.length) {
    handleSearchFormSubmission("book");
    page = "books";
  } else if (eventsSection.length) {
    handleSearchFormSubmission("event");
    page = "events";
  } else if (blogsSection.length) {
    handleSearchFormSubmission("blog");
    page = "blogs";
  } else if (bookDetails.length) {
    page = "books";
  } else if (eventDetails.length) {
    page = "events";
  } else {
    page = "blogs";
  }

  function handleSearchFormSubmission(item) {
    searchForm.submit(function (event) {
      event.preventDefault();
      errorElement.hide();
      const searchTerm = $('input[name="search"]').val().trim().toLowerCase();
      const filter = $('select[name="filter"]').val();
      let itemList;
      if (item == "book") {
        itemList = $(`.${item}s-list-item`);
      } else {
        itemList = $(`.${item}-list-item`);
      }

      if (!searchTerm) {
        itemList.show();
        return;
      }

      if (searchTerm.length > 20) {
        errorElement.text(
          "Error: The search term should be at most 20 characters."
        );
        errorElement.show();
        return;
      }

      $.ajax({
        method: "GET",
        url: `/${item}s/json`,
      }).then(function (dataList) {
        if (!dataList || dataList.length === 0) {
          errorElement.text("Error: Fail to get json!");
          errorElement.show();
          return;
        }
        let filteredItems = [];
        let idList = [];

        if (filter === "title") {
          filteredItems = dataList.filter((item) =>
            item.title.toLowerCase().includes(searchTerm)
          );
        } else if (filter == "author") {
          if (item == "book") {
            filteredItems = dataList.filter((book) => {
              if (book.authors && Array.isArray(book.authors)) {
                return book.authors.some((author) =>
                  author.toLowerCase().includes(searchTerm)
                );
              }
              return false;
            });
          } else if (item == "blog") {
            filteredItems = dataList.filter((user) => {
              let userName = `${user.author_info.firstName} ${user.author_info.lastName}`;
              return userName.toLowerCase().includes(searchTerm);
            });
          } else {
            filteredItems = dataList.filter((user) => {
              let userName = `${user.organizer_info.firstName} ${user.organizer_info.lastName}`;
              return userName.toLowerCase().includes(searchTerm);
            });
          }
        }
        idList = filteredItems.map((item) => item._id);
        itemList.each(function () {
          const id = $(this).attr("id");
          if (idList.includes(id)) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      });
    });
  }

  let requestConfig = {
    method: "GET",
    url: `/${page}/json`,
  };

  $.ajax(requestConfig).then(function (dataList) {
    if (!dataList || dataList.length === 0) {
      formErrorElement.text("Error: Fail to get json!");
      formErrorElement.show();
      return;
    }
    let idList = [];
    idList = dataList.map((item) => item._id);
    for (let id of idList) {
      const commentReviewForm = $(`#form-popup-${id}`);
      commentReviewForm.submit(function (event) {
        const content = $(`#content-${id}`).val();
        if (content.trim().length === 0) {
          event.preventDefault();
          formErrorElement.text("ERROR: Content is empty");
          formErrorElement.show();
        } else if (booksSection.length || bookDetails.length) {
          const rating = $(`#rating-${id}`).val();
          console.log(rating);
          if (isNaN(Number(rating))) {
            event.preventDefault();
            formErrorElement.text("ERROR: Rating must be a number");
            formErrorElement.show();
          }
          if (Number(rating) < 0 || Number(rating) > 5) {
            event.preventDefault();
            formErrorElement.text("ERROR: Rating must a number 0-5");
            formErrorElement.show();
          }
        } else {
          formErrorElement.hide();
        }
      });
    }
  });
});
