const Mentor = require('../models/mentorSchema')
const Student=require('../models/stydentSchema')
exports.createMentor = async (req, res) => {
  try {
    //check for valid mentor
    const validMentor = await Mentor.findOne({ id: req.body.id }).exec()
    //mentor is exist return error message
    if (validMentor) {
      return res.status(400).json({ message: 'mentor exist' })
    } else {
        //added mentor to db 
      const { name, id, profile } = req.body
      const create = await Mentor.create({
        name,
        id,
        profile
      })
      if (create) return res.status(200).json({ message: 'mentor added' })
      else return res.status(400).json({ message: 'created error' })
    }
  } catch (error) {
    console.log(error)
  }
}

exports.show_student_By_Mentor = async (req, res) => {
  try {
    //getting the mentor id
    const { id } = req.body
    const Student = await Mentor.findOne({ id: id }).exec()
    if (Student) {
        // send the student of that particular mentor
      return res.status(200).json({ Students: Student.students })
    } else return res.status(400).json({ message: 'mentor is not exist' })
  } catch (error) {
    console.log(error)
  }
}
//middleware function
exports.Assign_Menter = async (req, res,next) => {
  try {
    //getting mentor and not assigned(mentor) student details
    const mentor = req.body.id
    const NotMentor=req.StudentsNotMentor
     const AssigningStudents=req.body.Students
    console.log(AssigningStudents);
    const Available_Mentor = await Mentor.findOne({ id: mentor })
    if (Available_Mentor) {
      //find valid students (not are already assigned)  then update the mentor side
      const ValidStudent=await FindValidStudents(AssigningStudents,NotMentor)
      const Assigning=[...ValidStudent,...Available_Mentor.students]
      const Update=await Mentor.findOneAndUpdate({id:mentor},{
        $set:{
            "students":Assigning
        }
      })
      if(Update) {
        req.valid=ValidStudent
        next()
      }

    } else {
      //return not exist
      return res.status(400).json({message:"Mentor not exist"})
    }
  } catch (error) {
    console.log(error)
  }
}
//middleware function for get non assigned students
exports.Students_Not_Have_Mentor = async (req, res,next) => {
  try {
    const Students = await Student.find({ status: 'false' }).exec()
    let StudentObj={}
    await Students.map((student)=> StudentObj[student.admissionNumber]="false")
    req.StudentsNotMentor=StudentObj
    next()
  } catch (error) {
    console.log(error)
  }
}
// function for filter the valid students from users array of data
const FindValidStudents= async(arr,obj)=>{
    let ValidStudents=[]
    console.log(obj);
    await arr.map((item)=>{
        if(obj[item]){
            ValidStudents.push(item)
        }
    })
    return ValidStudents
}
