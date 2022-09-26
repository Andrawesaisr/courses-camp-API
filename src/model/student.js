const mongoose=require('mongoose')
const validator=require('validator')
const jwt=require('jsonwebtoken')
const Courses=require('./course')

const studentsSchema=new mongoose.Schema({
    name:{
        required:true,
        type:String,
        trim:true
    },
    email:{
        type:String,
        trim:true,
        lowercase:true,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minLength:7,
        required:true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Not allowed to enter password !!')
            }
        }
    },age:{
        type:Number,
        required:true
    },tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})
studentsSchema.virtual('course',{
    ref:'Courses',
    localField:'_id' ,
    foreignField:'owner'
})

studentsSchema.statics.findByCredentials=async(email,password)=>{
const student=await Students.findOne({email})
if(!student){
    throw new Error('Unable to login!!')
}
if(!student.password==password){
throw new Error('Unable to login!!')
}
return student
}

studentsSchema.methods.generateAuthToken=async function(){
    const student=this
    const token=jwt.sign({_id:student._id.toString()},'myProject')
    student.tokens=student.tokens.concat({token})
    await student.save()
    return token
}

studentsSchema.methods.toJSON=function(){
   const student=this
    const studentObject=student.toObject()
    delete studentObject.tokens
    delete studentObject.password

    return studentObject
}

studentsSchema.pre('remove',async function(next){
const student =this
await Courses.deleteMany({owner:student._id})

next()
})

const Students=mongoose.model('Students',studentsSchema)


module.exports=Students