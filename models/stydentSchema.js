const mongoose=require('mongoose')

const Studentschema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    admissionNumber:{
        type:String,
        unique:true
    },
    fatherName:{
        type:String,
        required:true
    },
    mentor:{
        type:String,
    },
    status:{
        type:String,
        default:"false"
    }
})
module.exports=mongoose.model("studentdb",Studentschema)