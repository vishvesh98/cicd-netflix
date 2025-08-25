const express=require('express')
const app=express();
const cors = require('cors');
require("dotenv").config();
const port= 5000

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your React app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true
  }));
require("./config/databse").connect();

const user=require('./routes/route')
app.use("/api/v1",user)

app.listen(port,()=>{
    console.log(`App is running on port ${port}`)
})

