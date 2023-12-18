document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.search-form');
    const booksSection = document.querySelector('.books-section');
    const booksListItems = booksSection.querySelectorAll('.books-list-item');
    let errorContainer = $('#error-container')
    let errorText = errorContainer.find('.text-goes-here')
    
    booksListItems.forEach(function (bookItem) {
        bookItem.style.display = 'none';
    });

    searchForm.addEventListener('submit', function (event) {
        event.preventDefault();
        errorContainer.hide()

        const query = document.querySelector('input[name="search"]').value.trim()
        if (!query || query.length <= 1) {
            errorText.text('Error: The search term should at least be 2 characters.')
            errorContainer.show()
            return
        }
        query = query.toLowerCase();
        const filter = document.querySelector('select[name="filter"]').value;

        filterBooks(query, filter);
    });

    function filterBooks(query, filter) {
        booksListItems.forEach(function (bookItem) {
            bookItem.style.display = 'none';

            let bookTitle, bookAuthors;

            if (filter === 'title') {
                bookTitle = bookItem.querySelector('.toBookDetails').textContent.toLowerCase();
                if (bookTitle.includes(query)) {
                    bookItem.style.display = 'block';
                }
            } else if (filter === 'author') {
                const authorListItems = bookItem.querySelectorAll('.authors-list li');
                bookAuthors = Array.from(authorListItems).map(li => li.textContent.toLowerCase());
                if (bookAuthors.some(author => author.includes(query))) {
                    bookItem.style.display = 'block';
                }
            }
        });
    }
});