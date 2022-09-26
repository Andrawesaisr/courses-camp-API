const mongoose=require('mongoose')

const coursesSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        lowercase:true
    },instructor:{
        type:String,
        trim:true,  
        required:true,
        lowercase:true
    },completed:{
        type:Boolean,
        default:false
    },owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Students'
    }
})


const Courses=mongoose.model('Courses',coursesSchema)


module.exports=Courses