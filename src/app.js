const express=require('express')
const dotenv=require('dotenv')
const studentRouter=require('./router/students')
const courseRouter=require('./router/courses')
require('./db/mongoose')
dotenv.config()
const app=express()
const port=process.env.PORT

app.use(express.json())
app.use(studentRouter)
app.use(courseRouter)






app.listen(3000,()=>{
    console.log(`Server is up on port ${3000}`)
})