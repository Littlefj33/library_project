document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.search-form');
    const booksSection = document.querySelector('.books-section');
    const booksListItems = booksSection.querySelectorAll('.books-list-item');
    const errorP = document.getElementById("error");
    
    booksListItems.forEach(function (bookItem) {
        bookItem.hidden = true;
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        errorP.hidden = true

        const query = document.querySelector('input[name="search"]').value.trim().toLowerCase()
        if (!query || query.length <= 1) {
            errorP.innerHTML = 'Error: The search term should at least be 2 characters.'
            errorP.hidden = false
            return
        }
        const filter = document.querySelector('select[name="filter"]').value;

        filterBooks(query, filter);
    });

    function filterBooks(query, filter) {
        booksListItems.forEach(function (bookItem) {
            bookItem.hidden = true;

            let bookTitle, bookAuthors;

            if (filter === 'title') {
                bookTitle = bookItem.querySelector('.toBookDetails').textContent.toLowerCase();
                if (bookTitle.includes(query)) {
                    bookItem.hidden = false;
                }
            } else if (filter === 'author') {
                const authorListItems = bookItem.querySelectorAll('.authors-list li');
                bookAuthors = Array.from(authorListItems).map(li => li.textContent.toLowerCase());
                if (bookAuthors.some(author => author.includes(query))) {
                    bookItem.hidden = false;
                }
            }
        });
    }
});