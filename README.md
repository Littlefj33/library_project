# library_project
Welcome to The Library! Here you will find the information you need in order to become a member and access our community.

**NOTE**: Reference the information on the “Home” page if you forget what each link does.

**Running the project:**
Download the zip file, unzip the file
Open the project in your code editor
Run `npm i` in the command line
Run `npm run seed` in the command line
Run `npm start` in the command line
Copy and paste the link to our website in your browser

**Log In:**
**NOTE**: Feel free to navigate the site, however, you are not signed in just yet. This means that you cannot request books, make reviews on books, comment on events/blogs, or create events/blog posts if you try to do any of these actions you will be sent to the login page.

Click on the profile photo on the top right of the screen.
Login with the credentials- email: test1@gmail.com and password: Test1234! and click submit.
This account is a user account so you will not have access to the /admin page.

**Review and Filter Books:**
Click on the “Books” link.
Search for “kid” in the search bar.
Click on “Review on Book” and fill out the review form for “Next Karate Kid, The”. Click on submit when you enter your review and your rating. This takes you to the Book info page where you can view information specific to this book.
Click on the “Back to Books” link.
Click on the link to the “Prime Suspect 3” book info page.
Click on “Review on Book” and fill out the review form. Click on submit when you enter your review and your rating.
Click on “Back to Books” link
Change the filter to “By Author” and search for “rita”
Click on the link to the “Laid to Rest” book info page.
Click on “Review on Book” and fill out the review form. Click on submit when you enter your review and your rating.
Click on “Back to Books” link
Change the filter to “By Author” and search for “rita” and notice that you cannot submit another review as it is limited to 1 review per book per user.



**Favorite a Book**
Click on the “Books” link at the top of the page or make a search with no input to get the list of all books. 
Notice that you cannot favorite the first book “Prime Suspect 3”.
Click on the Profile image at the top right corner of the page. Find your “Favorited Books” and notice how only “Prime Suspect 3” is on the list.
Click on the “Books” link.
Scroll down to the second book in the list, “Winter Hunter, Black Heart”
Click on “Favorite Book”. This takes you to the Book info page where you can view information specific to this book.
Click on “Back to Books” link and notice how you cannot favorite “Winter Hunter, Black Heart” as it has already been favorited.
Click on the Profile image at the top right corner of the page. Find your “Favorited Books” and notice how “Winter Hunter, Black Heart” is on the list.
Click on the “Books” link.
Scroll down to the third book “Bambou” and click on the title link.
Click on “Favorite Book”.
Click on the “Back to Books” link and notice how you cannot favorite “Bambou” as it has just been favorited.’
Click on the Profile image at the top right corner of the page. Find your “Favorited Books” and notice how “Bambou” is on the list.

**Request a Book**
While in the profile page, notice that there are two books currently checked out, “Bambou” and “Scissere”
Click on the “Books” link at the top of the page.
Click on the title link to “Prime Suspect 3” to take you to the info page for it.
Notice the “Number in Stock” field says 2. Click on “Request Book” and notice that the page reloads, the “Number in Stock” field is now down to 1 and the “Request Book” button now says “Return Book”
Click on the Profile image at the top right corner of the page. Find your “Checked Out Books” and notice how “Prime Suspect 3” is on the list.
Click on the “Books” link at the top of the page.

**Returning a Book**
Search for “sci” in the search bar with the filter as “By Title”
Click on “Return Book” from this page. Notice it takes you to an error page as the Admin must approve the return of a book before it is returned.
Click on the “Books” link at the top of the page.
Click on the title link to “Prime Suspect 3” and go to the info page.
Click on “Return Book”. Notice it takes you to an error page as the Admin must approve the return of a book before it is returned.

**Create and Comment on an Event**
Click on the “Events” link at the top of the page.
Click on the “Create New Event” under the search bar.
Enter event details and click submit. It takes you to the event info page.
From this page, click on “Comment on Event” and submit a comment. Notice that the comments count is now 1 and your comment is listed.
Click on “Back to Events”. Notice your event is now listed.
Click on the “Comment on Event” button for the first event on the list, “Title 1 Here”. Notice the comment count is 1. Submit your comment. Notice that it takes you to the event info page for “Title 1 Here” and your comment is listed below and the count is 2.
**NOTE**: you can comment an unlimited number of times on an event.

**Join and Filter an Event**
From this page, notice the number of people attending is 1.
Click on “Join Event”. Notice the button disappears and the number of people attending increases to 2.
Click on the “Back to Events” link. Notice for the first event on the list that the join event button is not there.
Search for the event you created using the “By Author” filter and the search term “TestO” and click on “Join Event” for it. Notice it takes you to the info page for the event, the “Join Event” button has disappeared and the number of people attending the event is now 1.
**NOTE**: you must be above the age limit to join the event.

**Create, Comment and Filter on an Blog**
Click on the “Blogs” link at the top of the page.
Click on the “Create New Blog” under the search bar.
Enter blog details and click submit. It takes you to the blog info page.
From this page, click on “Comment on Blog” and submit a comment. Notice that the comments count is now 1 and your comment is listed.
Click on “Back to Blogs”. Notice your event is now listed. Search for “TestT” using the “By Author” filter.
Click on the “Comment on Blog” button for the blog, “Title 2 Here”. Notice the comment count is 1. Submit your comment. Notice that it takes you to the blog info page for “Title 1 Here” and your comment is listed below and the count is 2.
**NOTE**: you can comment an unlimited number of times on a blog.

**Log Out**
Click on the profile image at the top right corner of the page.
Click “Logout”.

**Approving Book Returns** 
Click on “Back to Login”
Sign in with the credentials- email: test2@gmail.com and password: Test1234!
Click on the profile image at the top right corner. Notice how the Admin has “Assassination of a High School President” listed in the return requests.
Click on “Link to Admin Page”.
Click on “Process Return” for “User: testTwo”, “Book: Assassination… President”. Notice it is no longer on the page. Now if you search for the book in the books page, you can request the book again.
Click on the profile image at the top right corner. Notice that return requests are now empty.

**Updating Book Info**
Click on the “Books” link at the top of the page
Click on the title link to “Prime Suspect 3” to be taken to the info page.
Copy the ISBN number for this book. Notice that the number in stock is currently 1, and the “Condition Status” of the book is “Good”.
Click on the Profile image at the top right corner of the page.
Click on “Link to Admin Page”.
Paste the ISBN number (445798791-3) in the ISBN field. Increase the stock by 5 and set quality to “Fair” and click “Update Book”.
Click on “Books” at the top of the page.
Click on the title link to “Prime Suspect 3” to be taken to the info page. Notice that the number in stock is now 6, and the “Condition Status” of the book is “fair”.

**NOTE**: the admin can do all the same actions as the user.
