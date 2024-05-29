require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const port = process.env.PORT;
const path = require("path");
const app = express();
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const checkForAuthenticationCookie = require("./middleware/authentication");
const blogRouter = require("./routes/blog");

const Blog = require("./models/blog");
//
mongoose.connect(process.env.MONGODB_URL).then(() => {
  console.log("Connected to MongoDB");
});

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  try {
    const allBlogs = await Blog.find({}); // Wait for the promise to resolve
    res.render("homepage", { user: req.user, blogs: allBlogs });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
app.use("/user", userRouter);
app.use("/blog", blogRouter);

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
