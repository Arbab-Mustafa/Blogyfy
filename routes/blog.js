const { Router } = require("express");
const multer = require("multer");
const path = require("path");
const Blog = require("../models/blog");
const Comment = require("../models/comment");

//

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

//
const blogRouter = Router();

blogRouter.get("/add-new-blog", (req, res) => {
  res.render("addBlog", {
    user: req.user,
  });
});

blogRouter.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "createdBy"
  );
  res.render("blog", {
    blog,
    user: req.user,
    comments,
  });
});

blogRouter.post("/", upload.single("file"), async (req, res) => {
  const { title, body } = req.body;
  const newBlog = await Blog.create({
    title,
    body,
    coverImgUrl: `/uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${newBlog._id}`);
});

blogRouter.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = blogRouter;
