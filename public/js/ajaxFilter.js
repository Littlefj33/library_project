$(document).ready(function () {
    const searchForm = $('.search-form');
    const booksSection = $('.books-section');
    const eventsSection = $('.events-section');
    const blogsSection = $('.blogs-section');
    const errorElement = $('.alert');

    if (booksSection.length) {
        handleSearchFormSubmission('book');
    }
    
    if (eventsSection.length) {
        handleSearchFormSubmission('event');
    }
    
    if (blogsSection.length) {
        handleSearchFormSubmission('blog');
    }

    function handleSearchFormSubmission(item) {
        searchForm.submit(function (event) {
            event.preventDefault();
            errorElement.hide();
            const searchTerm = $('input[name="search"]').val().trim().toLowerCase();
            const filter = $('select[name="filter"]').val();
            let itemList;
            if (item == 'book') {
                itemList = $(`.${item}s-list-item`);
            } else {
                itemList = $(`.${item}-list-item`);
            }
            
            
            if (!searchTerm) {
                itemList.show();
                return;
            }
            
            if (searchTerm.length > 20) {
                errorElement.text("Error: The search term should be at most 20 characters.");
                errorElement.show();
                return; 
            }
            
            $.ajax({
                method: 'GET',
                url: `/${item}s/json`
            }).then(function (dataList) {
                if (!dataList || dataList.length === 0) {
                    errorElement.text('Error: Fail to get json!');
                    errorElement.show();
                    return;
                }
                let filteredItems = [];
                let idList = [];

                if (filter === 'title') {
                    filteredItems = dataList.filter(item => item.title.toLowerCase().includes(searchTerm));
                } else if (filter == 'author') {
                    if (item == 'book') {
                        filteredItems = dataList.filter(book => {
                            if (book.authors && Array.isArray(book.authors)) {
                                return book.authors.some(author => author.toLowerCase().includes(searchTerm));
                            }
                            return false
                        });
                    } else if (item == 'blog'){
                        filteredItems = dataList.filter(user => {
                            let userName = `${user.author_info.firstName} ${user.author_info.lastName}`
                            return userName.toLowerCase().includes(searchTerm);
                        });                      
                    } else {
                        filteredItems = dataList.filter(user => {
                            let userName = `${user.organizer_info.firstName} ${user.organizer_info.lastName}`
                            return userName.toLowerCase().includes(searchTerm);
                        });
                    }
                }
                idList = filteredItems.map(item => item._id);          
                itemList.each(function () {
                    const id = $(this).attr('id');
                    if (idList.includes(id)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            });
        });
    }
});