$(document).ready(function () {
    const booksSection = $('.books-section')
    const eventsSection = $('.events-section')
    const blogsSection = $('.blogs-section')
    const ra
    const errorElement = $('.alert')
    if(booksSection) {


    }

    function handleSearchFormSubmission(item) {
        searchShowsForm.submit(function (event) {
            event.preventDefault()
            errorElement.hide()
            errorText.empty()
            const searchTerm = $('input[name="search"]').val().toLowerCase();
            const filter = $('select[name="filter"]').val();
            const itemList = $(`.${item}s-list-item`);
            if (!searchTerm) {
                return
            }
            if (searchTerm.length > 20) {
                errorElement.text("Error: The search term should be at most 20 characters.");
                errorElement.show()
            }
            $.ajax({
                method: 'GET',
                url: `/${item}s/json`
            }).then(function (dataList) {
                if (!dataList || dataList.length === 0) {
                    errorElement.text('Error: Fail to get json!')
                    errorElement.show()
                } 
                if (filter == title) {

                }
                var filteredItems = contentList.filter(item => item[title].includes(keyword));
                var idList = filteredItems.map(item => {item._id});

                allBookItems.each(function() {
                    var bookId = $(this).find('.toBookDetails').attr('href').split('/').pop(); // 获取每个书籍条目的 ID
                    if (knownBookIds.includes(bookId)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });

// 使用 map 方法提取所需的属性
var result = filteredItems.map(item => {
    return {
        _id: item._id,
        title: item.title,
        author: item.author
    };
});
                tvShowList.empty()
                results.forEach(item => tvShowList.append(createShowLink(item.show)))
                tvShowList.show()
                showDetails.hide()
                
            })
            rootLink.show()
        })
    }


    const messageElement = $('<div class="message"></div>');
    messageElement.hide(); 
    const countMessageElement = $('<p class="count-message"></p>');
    countMessageElement.hide();

    function renderData(data) {
        const bookList = $('.books-list-item');
        dataList.empty();
        const limitedData = data.slice(0, 100);

        limitedData.forEach(function (item) {
            const itemElement = $('<div class="item"></div>');
            const title = $('<h2></h2>');
            const titleLink = $('<a></a>').attr('href', '/books/' + item._id).text(item.title);
            title.append(titleLink);

            const authors = $('<p></p>').text('Authors: ' + item.authors.join(', '));

            itemElement.append(title);
            itemElement.append(authors);

            dataList.append(itemElement);
        });
        countMessageElement.text(`Matched ${limitedData.length} books.`);
        countMessageElement.show();
    }

    $('.search-form').submit(function (event) {
        event.preventDefault();
        const query = $('input[name="search"]').val().toLowerCase();
        const filter = $('select[name="filter"]').val();

        $.ajax({
            url: '/books/data',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                renderData(data);

                messageElement.text('Search completed.');
                messageElement.show();
            },
            error: function (error) {
                console.error('Error fetching data:', error);
            }
        });
    });

    $('body').prepend(countMessageElement);
    $('body').prepend(messageElement);
});
