const express = require("express");
const userRouter = express.Router();
const { User } = require("../models/index");

userRouter.use(express.json());
userRouter.use(express.urlencoded({ extended: true }));

userRouter.get("/", async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

userRouter.get("/:id", async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

userRouter.post("/", async (req, res) => {
  const newUser = await User.create(req.body);
  res.json(newUser);
});

userRouter.put("/:id", async (req, res) => {
  const updatedUser = await User.update(req.body, {
    where: { id: req.params.id },
  });
  res.json(updatedUser);
});

userRouter.delete("/:id", async (req, res) => {
  const deletedUser = await User.destroy({
    where: { id: req.params.id },
  });

  res.json(deletedUser);
});

module.exports = userRouter;
