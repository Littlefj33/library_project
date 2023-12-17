$(document).ready(function () {
    const searchForm = $('#searchShows');
    const booksContainer = $('#book-list');

    function filterBooks(books, query, filter) {
        books.each(function () {
            const book = $(this);
            const title = book.find('h3').text().toLowerCase();
            const author = book.find('.author').text().toLowerCase();

            if (filter === 'title' && title.includes(query) || filter === 'author' && author.includes(query)) {
                book.show();
            } else {
                book.hide();
            }
        });
    }

    searchForm.submit(function (event) {
        event.preventDefault();
        const searchInput = $('input[name="search"]');
        const filter = $('select[name="filter"]').val();
        const query = searchInput.val().trim().toLowerCase();

        if (validateInput(query)) {
            filterBooks(booksContainer.find('.book'), query, filter);
        } else {
            alert('Please enter a valid search query.');
        }
    });

    function validateInput(input) {
        if (!input || input.length === 0 || input.length > 50) {
            return false;
        }
        return true;
    }

});