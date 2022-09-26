const express=require('express')
const Courses= require('../model/course')
const Auth=require('../middleware/auth')
const { update } = require('../model/course')
const router=express.Router()

router.post('/course/enter',Auth,async(req,res)=>{
const course=new Courses({
    ...req.body,
    owner:req.student._id
})
try{
await course.save()
res.send(course)

}catch(e){
res.send(e)
}
})

router.get('/MyCourses',Auth,async(req,res)=>{
try{
await req.student.populate({path:'course'})
res.send(req.student.course)
}catch(e){
res.send(e) 
}
})

router.patch('/course/:id',Auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const allowed=['completed']
   const result= updates.every((update)=>allowed.includes(update))
   if(!result){
    res.send('Invalid updates') 
   }
   try{
    const course=await Courses.findOne({_id:req.params.id,owner:req.student._id})
    if(!course){
        return res.status(404).send()
    }
   updates.forEach((update)=>course[update]=req.body[update])
   await course.save()
   res.send(course)
   }catch(e){
    res.send(e)
   }
})

router.delete('/course/:id',Auth,async(req,res)=>{
    try{    
       const course= await Courses.findByIdAndDelete({_id:req.params.id,owner:req.student._id})
       if(!course){
        return res.status(404).send()
       }
        res.send(course)
    }catch(e){
        res.send(e)
    }
})

module.exports=router