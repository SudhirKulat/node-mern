const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Something went wrong" + "" + err);
  }
});

//User API GET user
app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const fetachedUser = await User.find({ emailId: userEmail });
    if (!fetachedUser?.length) {
      res.status(400).send("User not found");
    } else {
      res.send(fetachedUser);
    }
  } catch (error) {
    res.status(400).send("somethig went wromg" + error.message);
  }
});

//Feed API, get all the users

app.get("/feed", async (req, res) => {
  try {
    const fetachedUsers = await User.find({});
    if (!fetachedUsers?.length) {
      res.status(400).send("Users not found");
    } else {
      res.send(fetachedUsers);
    }
  } catch (error) {
    res.status(400).send("somethig went wrong" + error.message);
  }
});

//DELETE user

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    console.log(deletedUser);
    res.send("user deleted successfully..!!");
  } catch (error) {
    res.status(400).send("something went wrong", error.message);
  }
});

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const payload = req.body;

  const ALLOWED_UPDATES = [
    "skills",
    "about",
    "photoURL",
    "password",
    "gender",
  ];
  const isUpdateallowed = Object.keys(payload).every((k) =>
    ALLOWED_UPDATES.includes(k)
  );
  try {
    if (!isUpdateallowed) {
      throw new Error("Update not allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, payload, {
      runValidators: true,
    });
    console.log(updatedUser);
    res.send("user updated successfully..!!");
  } catch (error) {
    res.status(400).send("Failed to update" + " " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("DB conncetd successfully");
    app.listen(3000, () => console.log("listening on port 3000"));
  })
  .catch((err) => console.log("failed to connect", err));
