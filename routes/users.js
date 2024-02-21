const express = require("express");
const userRouter = express.Router();
const { User } = require("../models/index");

const { check, validationResult } = require("express-validator");

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

userRouter.post(
  "/",
  [check("name").not().isEmpty().trim(), check("age").not().isEmpty().trim()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const newUser = await User.create(req.body);
        const allUsers = await User.findAll();
        res.json(allUsers);
      }
    } catch (e) {
      next(e);
    }
  }
);

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
