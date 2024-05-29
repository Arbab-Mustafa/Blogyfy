const { Router } = require("express");
const User = require("../models/user");

const userRouter = Router();

userRouter.get("/signin", (req, res) => {
  res.render("signin", { title: "User" });
});

userRouter.get("/signup", (req, res) => {
  res.render("signup", { title: "User" });
});

userRouter.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  await User.create({ name, email, password });
  res.redirect("/");
});

userRouter.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordandGenerateToken(email, password);
    if (!token) {
      return res.redirect("/user/signin");
    }

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("signin", {
      error: "Invalid email or password",
    });
  }
});

userRouter.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/user/signin");
});

module.exports = userRouter;
