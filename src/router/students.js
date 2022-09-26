const express=require('express')
const Students=require('../model/student')
const Auth=require('../middleware/auth')
const router=express.Router()   

router.post('/student',async(req,res)=>{
   const email=req.body.email
   const check= await Students.findOne({email})
   if(check){
      return res.send({'error':'this email is used'})
   }
    const student=new Students(req.body)
         try{
               await student.save()
               const token= await student.generateAuthToken()
               res.send({student,token})
         }catch(e){
         res.status(400).send(e) 
         }
})
router.post('/student/login',async(req,res)=>{
   try{
      const student=await Students.findByCredentials(req.body.email,req.body.password)
      const token=await student.generateAuthToken()
      res.send({student,token})
   }catch(e){
      res.status(400).send(e)
   }
})

router.post('/student/logout',Auth,async(req,res)=>{
   try{
      req.student.tokens=req.student.tokens.filter((token)=>{
         return token.token!==req.token
      })
     
      await req.student.save()

      res.send('logout is done')

   }catch(e){
      res.status(501).send() 
   }
})

router.patch('/student/update',Auth,async(req,res)=>{
   const updates=Object.keys(req.body)
   const allowed=['password','age']
   const result=updates.every((update)=>allowed.includes(update))
   if(!result){
      res.status(404).send({'error':'invalid updates'})
   }

try{

updates.forEach((update)=>req.student[update]=req.body[update])
await req.student.save()
res.send(req.student)

}catch(e){
res.status(400).send() 
}
})

router.get('/student/profile',Auth,async(req,res)=>{
   try{
      res.send(req.student)
   }catch(e){
      res.send(e)
   }
})
router.delete('/student/delete',Auth,async(req,res)=>{
try{
req.student.remove()
res.send('this student has been deleted')
}catch(e){
res.send(e) 
}

})



module.exports=router