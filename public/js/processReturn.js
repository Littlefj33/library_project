(function ($) {
    // function to process book return
    function processReturn(bookId, userEmail) {
        // validation
        if (!bookId || !userEmail) {
            alert('Book ID or User Email is missing.');
            return;
        }

        // AJAX request configuration
        let requestConfig = {
            method: 'POST',
            url: '/',
            contentType: 'application/json',
            data: JSON.stringify({ bookId: bookId, userEmail: userEmail })
        };

        // AJAX call
        $.ajax(requestConfig).then(function (responseMessage) {
            console.log('Book returned successfully:', responseMessage);
            alert('Book return processed successfully.');
        }).fail(function (jqXHR, errorThrown) {
            console.error('Error returning book:', errorThrown);
            alert('Error processing book return.');
        });
    }


    // bind click events to return buttons
    $('.return-button').on('click', function () {
        let bookId = $(this).data('bookid');
        let userEmail = $(this).data('useremail');

        processReturn(bookId, userEmail);
    });

})(window.jQuery);
