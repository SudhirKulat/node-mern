const express = require("express");
const connectDB = require("./config/database");
const User = require('./models/user');
const app = express();

app.use(express.json())

app.post('/signup', async (req, res)=>{
    const user = new User(req.body);
    try{
      await user.save();
      res.send("User added successfully")
    }catch(err){
      res.status(400).send('Something went wrong', err)
    }

})
connectDB()
  .then(() => {
    console.log("DB conncetd successfully");
    app.listen(3000, () => console.log("listening on port 3000"));    
  })
  .catch((err) => console.log("failed to connect", err));
