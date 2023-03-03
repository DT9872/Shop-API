// require the express module
import express from "express";
import { getClient } from "../db";
import { ObjectId } from "mongodb";
import CartItem from "../models/CartItem";

const cartItemRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

//endpoints go here

cartItemRouter.get("/users/:userId/cart", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const client = await getClient();
    const results = await client
      .db()
      .collection<CartItem>("cartItems")
      .find({ userId })
      .toArray();
    if (results.length === 0) {
      res.status(404).json({ message: "No user found" });
    } else {
      res.status(200).json(results);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

// cartItemRouter.post("/users/:userId/cart", async (req, res) => {
//     try {
//       const cartItem: CartItem = req.body;
//       const userId: new ObjectId(req.params.userId);
//       const client = await getClient();
//       const existingCartItem = await client
//         .db()
//         .collection<CartItem>("cartItems")
//         .findOne(
//           { userId: userId, "product._id": new ObjectId(cartItem.product._id) },
//           { projection: { _id: 0 } }
//         );
//       if (existingCartItem) {
//         await client
//           .db()
//           .collection<CartItem>("cartItems")
//           .updateOne(
//             { userId, "product._id": new ObjectId(cartItem.product._id) },
//             { $inc: { quantity: cartItem.quantity } }
//           );
//         res.status(200);
//         existingCartItem.quantity += cartItem.quantity;
//         res.json(existingCartItem);
//       } else {
//         cartItem.product._id = new ObjectId(cartItem.product._id);
//         cartItem.userId = userId;
//         await client.db().collection<CartItem>("cartItems").insertOne(cartItem);
//         res.status(201).json(cartItem);
//       }
//     } catch (err) {
//       errorResponse(err, res);
//     }
//   });

cartItemRouter.patch("/users/:userId/cart/:productId", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const productId = new ObjectId(req.params.productId);
    const quantityObject = req.body;
    const client = await getClient();
    const result = await client
      .db()
      .collection<CartItem>("cartItems")
      .updateOne(
        { userId, "product._id": productId },
        { $set: { quantity: quantityObject.quantity } }
      );
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(quantityObject);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

cartItemRouter.delete(" /users/:userId/cart/:productId", async (req, res) => {
  try {
    const userId = new ObjectId(req.params.userId);
    const productId = new ObjectId(req.params.productId);
    const client = await getClient();
    const result = await client
      .db()
      .collection<CartItem>("cartItems")
      .deleteOne({ userId, "product._id": productId });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default cartItemRouter;
