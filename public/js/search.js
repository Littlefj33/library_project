document.addEventListener('DOMContentLoaded', function () {
    const searchForm = document.querySelector('.search-form');
    const blogSection = document.querySelector('.blogs-section');
    const bookSection = document.querySelector('.books-section');
    const eventSection = document.querySelector('.events-section');
    const errorP = document.querySelector('.alert');
    
    if (bookSection) {
        const booksListItems = bookSection.querySelectorAll('.books-list-item');
        searchForm.addEventListener('submit', function (event) {
            handleSearch(event, booksListItems, filterBooks);
        });
    }

    if (blogSection) {
        const blogsListItems = blogSection.querySelectorAll('.blog-list-item');
        searchForm.addEventListener('submit', function (event) {
            handleSearch(event, blogsListItems, filterBlogs);
        });
    }

    if (eventSection) {
        const eventsListItems = eventSection.querySelectorAll('.event-list-item');
        searchForm.addEventListener('submit', function (event) {
            handleSearch(event, eventsListItems, filterEvents);
        });
    }

    function handleSearch(event, listItems, filterFunction) {
        event.preventDefault();
        errorP.hidden = true;

        const query = document.querySelector('input[name="search"]').value.trim().toLowerCase();
        if (!query || query.length <= 1) {
            errorP.innerHTML = 'Error: The search term should be at least 2 characters.';
            errorP.hidden = false;
            return;
        }
        if (query.length > 20) {
            errorP.innerHTML = 'Error: The search term should be at most 20 characters.';
            errorP.hidden = false;
            return;
        }
        const filter = document.querySelector('select[name="filter"]').value;

        listItems.forEach(function (item) {
            if (filterFunction(item, query, filter)) {
                item.hidden = false;
            } else {
                item.hidden = true;
            }
        });
    }

    function filterBooks(bookItem, query, filter) {
        let bookTitle, bookAuthors;

        if (filter === 'title') {
            bookTitle = bookItem.querySelector('.toBookDetails').textContent.toLowerCase();
            return bookTitle.includes(query);
        } else if (filter === 'author') {
            const authorListItems = bookItem.querySelectorAll('.authors-list li');
            bookAuthors = Array.from(authorListItems).map(li => li.textContent.toLowerCase());
            return bookAuthors.some(author => author.includes(query));
        }

        return false;
    }

    function filterBlogs(blogItem, query, filter) {
        let blogTitle, authorName;

        if (filter === 'title') {
            blogTitle = blogItem.querySelector('.toBlogDetails').textContent.toLowerCase();
            return blogTitle.includes(query);
        } else if (filter === 'author') {
            authorName = blogItem.querySelector('.author').textContent.toLowerCase();
            authorName = authorName.replace('Author:', '').trim();
            return authorName.includes(query);
        }

        return false;
    }

    function filterEvents(eventItem, query, filter) {
        let eventTitle, eventDescription;

        if (filter === 'title') {
            eventTitle = eventItem.querySelector('.toEventDetails').textContent.toLowerCase();
            return eventTitle.includes(query);
        } else if (filter === 'description') {
            eventDescription = eventItem.querySelector('.description').textContent.toLowerCase();
            return eventDescription.includes(query);
        }

        return false;
    }
});