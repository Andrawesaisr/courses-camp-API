const jwt=require('jsonwebtoken')
const Students=require('../model/student')

const Auth=async(req,res,next)=>{
try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decode = jwt.verify(token,'myProject')  
    const student=await Students.findOne({_id:decode._id ,'tokens.token':token})
if(!student){
    throw new Error()
}
req.student=student
req.token=token

next()

}catch(e){
res.send({'error':'please authenticate'})
}
}

module.exports=Auth