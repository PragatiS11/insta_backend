const express = require("express");
const { auth } = require("../middleware/auth.middleware");
const { PostModel } = require("../model/post.model");

const postRouter = express.Router();

postRouter.use(auth);

postRouter.post("/add", async (req, res) => {
  const { title, body, device, no_of_comments, userID, username } = req.body;
  try {
    const post = new PostModel({
      title,
      body,
      device,
      no_of_comments,
      userID,
      username,
    });
    await post.save();
    res.status(200).send({ msg: "new post has been added" });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.get("/", async (req, res) => {
  try {
    const { device, sortby, page = 1, limit = 3, order = "asc" } = req.query;
    let query = {};

    if (device) {
      query.device = { $regex: device, $option: "i" };
    }
    const sortOption = {};

    if (sortby) {
      sortOption[sortby] = order == "asc" ? 1 : -1;
    }

    const skipCount = (page - 1) * limit;
    const post = await PostModel.find(query)
      .sort(sortOption)
      .skip(skipCount)
      .limit(Number(limit));

    res.status(200).send(post);
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.patch("/update/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findOne({ _id: id });
  try {
    if (req.body.userID == post.userID) {
      await PostModel.findByIdAndUpdate({ _id: id }, req.body);
      res.status(200).send({ msg: `the note has been updated with id ${id}` });
    } else {
      res.status(200).send({ msg: "you are not authorised" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

postRouter.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  const post = await PostModel.findOne({ _id: id });
  try {
    if (req.body.userID == post.userID) {
      await PostModel.findByIdAndDelete({ _id: id });
      res.status(200).send({ msg: `the note has been deleted with id ${id}` });
    } else {
      res.status(200).send({ msg: "you are not authorised" });
    }
  } catch (error) {
    res.status(400).send({ error: error });
  }
});
module.exports = { postRouter };
