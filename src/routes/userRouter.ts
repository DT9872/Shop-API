// require the express module
import express from "express";
import User from "../models/User";
import { getClient } from "../db";
import { ObjectId } from "mongodb";

const userRouter = express.Router();

const errorResponse = (error: any, res: any) => {
  console.error("FAIL", error);
  res.status(500).json({ message: "Internal Server Error" });
};

userRouter.get("/users/:id", async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client.db().collection<User>("users").findOne({ _id });
    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User Not Found" });
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.post("/users", async (req, res) => {
  try {
    const newUser: User = req.body as User;
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .insertOne(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.put("/users/:id", async (req, res) => {
  try {
    const updatedUser: User = req.body as User;
    delete updatedUser._id;
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .replaceOne({ _id }, updatedUser);
    if (result.modifiedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      updatedUser._id = _id;
      res.status(200).json(updatedUser);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

userRouter.delete("/users/:id", async (req, res) => {
  try {
    const _id = new ObjectId(req.params.id);
    const client = await getClient();
    const result = await client
      .db()
      .collection<User>("users")
      .deleteOne({ _id });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    errorResponse(err, res);
  }
});

export default userRouter;
