import { dbTool } from "../data/dbTools.js";
import { blogs, users } from "../config/mongoCollections.js";
import { Router } from "express";
import { createBlog } from "../data/blogs.js";
const router = Router();

router.route("/").get(async (req, res) => {
  return res.render("blogs", { title: "Blogs" });
});

router
  .route("/create")
  .get(async (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect("/login");
    } else {
      return res.render("createBlog", {
        title: "Create Blog",
        partial: "createBlogValidation",
      });
    }
  })
  .post(async (req, res) => {
    const user = req.session.user;
    if (!user) {
      return res.redirect("/login");
    } else {
      // prettier-ignore
      const { blogTitle, content } = req.body;
      try {
        // prettier-ignore
        const results = await createBlog(user.emailAddress, blogTitle, content);
        if (results.insertedEvent === true) {
          return res.redirect(`/blogs/${results.id}`);
        } else {
          return res.status(500).render("error", {
            title: "ERROR Page",
            error: "Internal Server Error",
          });
        }
      } catch (e) {
        return res.status(400).render("createBlog", {
          title: "Create Blog",
          partial: "createBlogValidation",
          error: e,
        });
      }
    }
  });

router.route("/:blogId").get(async (req, res) => {
  const blogId = req.params.blogId.trim();
  const blogCollection = await blogs();
  const userCollection = await users();
  let data;
  try {
    let blogData = await dbTool(blogCollection, "_id", blogId, {
      _id: 1,
      author_id: 1,
      title: 1,
      content: 1,
      date_posted: 1,
      comments: 1,
    });
    let authorInfo = await dbTool(
      userCollection,
      "_id",
      blogData[0]["author_id"].toString(),
      { _id: 0, firstName: 1, lastName: 1, emailAddress: 1 }
    );
    delete blogData[0]["author_id"];
    blogData[0]["author_info"] = authorInfo[0];
    data = blogData[0];
  } catch (e) {
    return res.status(404).render("error", {
      title: "ERROR Page",
      error: "Page not found",
    });
  }
  return res.render("blogDetails", { title: "Blog Info", data });
});

/* Maybe remove?? */
router.route("/:blogId/comment").get(async (req, res) => {
  return res.render("blogComments", { title: "Blogs" });
});

export default router;
