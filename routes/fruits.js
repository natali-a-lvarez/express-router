const express = require("express");
const fruitsRouter = express.Router();
const { Fruit } = require("../models/index");

const { check, validationResult } = require("express-validator");

fruitsRouter.use(express.json());
fruitsRouter.use(express.urlencoded({ extended: true }));

fruitsRouter.get("/", async (req, res) => {
  const fruits = await Fruit.findAll();
  res.json(fruits);
});

fruitsRouter.get("/:id", async (req, res) => {
  const fruit = await Fruit.findByPk(req.params.id);
  res.json(fruit);
});

fruitsRouter.post(
  "/",
  [check("name").not().isEmpty().trim(), check("color").not().isEmpty().trim()],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.json({ error: errors.array() });
      } else {
        const newFruit = await Fruit.create(req.body);
        res.json(newFruit);
      }
    } catch (e) {
      next(e);
    }
  }
);

fruitsRouter.put("/:id", async (req, res) => {
  const updatedFruit = await Fruit.update(req.body, {
    where: { id: req.params.id },
  });
  res.json(updatedFruit);
});

fruitsRouter.delete("/:id", async (req, res) => {
  const deletedFruit = await Fruit.destroy({
    where: { id: req.params.id },
  });

  res.json(deletedFruit);
});

module.exports = fruitsRouter;
