const mongoose=require('mongoose')

const MentorSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    id:{
        type:String,
        required:true,
        unique:true
    },
    students:[{type:String}],
    profile:{
        type:String

    }
})

module.exports=mongoose.model("mentordb",MentorSchema)