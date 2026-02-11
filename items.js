const express = require("express");
const ExpressError = require("../middleware/ExpressError");
const items = require("../fakeDb");

const router = new express.Router();

/** GET /items - list all items */
router.get("/", function (req, res) {
  return res.json(items);
});

/** POST /items - add item: {name, price} */
router.post("/", function (req, res, next) {
  const { name, price } = req.body;

  if (name === undefined || price === undefined) {
    return next(new ExpressError("Name and price required", 400));
  }

  const newItem = { name, price };
  items.push(newItem);

  return res.status(201).json({ added: newItem });
});

/** GET /items/:name - get single item */
router.get("/:name", function (req, res, next) {
  const foundItem = items.find((i) => i.name === req.params.name);
  if (!foundItem) return next(new ExpressError("Item not found", 404));
  return res.json(foundItem);
});

/** PATCH /items/:name - update name and/or price */
router.patch("/:name", function (req, res, next) {
  const foundItem = items.find((i) => i.name === req.params.name);
  if (!foundItem) return next(new ExpressError("Item not found", 404));

  const { name, price } = req.body;

  if (name !== undefined) foundItem.name = name;
  if (price !== undefined) foundItem.price = price;

  return res.json({ updated: foundItem });
});

/** DELETE /items/:name - delete item */
router.delete("/:name", function (req, res, next) {
  const idx = items.findIndex((i) => i.name === req.params.name);
  if (idx === -1) return next(new ExpressError("Item not found", 404));

  items.splice(idx, 1);
  return res.json({ message: "Deleted" });
});

module.exports = router;
