const express=require('express');
const app=express();

app.use(express.json());

const input=require('./routes/input')

app.use('/',input)

const PORT=process.env.PORT||5000;
app.listen(PORT,console.log(`Server started on ${PORT}`))