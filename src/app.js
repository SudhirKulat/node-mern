const express = require('express');

const app = express();

app.use("/hello", (req, res)=>{
res.send('hello from dashboad///');
});

app.use("/test", (req, res)=>{
    res.send('hello from test....');
});


app.listen(3000, ()=> console.log('listening on port 3000'))