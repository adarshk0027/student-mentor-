const Student = require('../models/stydentSchema')
const MentorSchema = require('../models/mentorSchema')
const { findOne } = require('../models/stydentSchema')
exports.Create_Student = async (req, res) => {
  try {
    //student exist or not checking
    const validStudent = await Student.findOne({
      admissionNumber: req.body.admissionNumber
    }).exec()
   // student is exist return error message
    if (validStudent) {
      return res.status(400).json({
        message: 'student already exist'
      })
    } else {
         //student exist add student with menter status false
      const { name, admissionNumber, fatherName } = req.body
      const create = await Student.create({
        name,
        admissionNumber,
        fatherName
      })
      if (create)
        return res.status(200).json({
          message: 'student added'
        })
      else {
        return res.status(400).json({ message: 'added failed' })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

exports.Assign_Chgange_Mentor_For_Student = async (req, res) => {
  try {
    //find the mentor and student are exist or not
    //getting previously assigned mentor for pull the student from mentors students array

    const student = req.body.admissionNumber
    const Mentorid = req.body.id
    const Available_Student = await Student.findOne({
      admissionNumber: student
    })
    //previos mentor finding
    const previousMentor = Available_Student.mentor && Available_Student.mentor
    const AvailableMentor = await MentorSchema.findOne({ id: Mentorid })
    if (Available_Student && AvailableMentor) {
      const StudentsInMentor = AvailableMentor.students.find(
        item => item == student
      )
      if (StudentsInMentor && Available_Student.mentor == Mentorid)
        return res.status(400).json({ message: 'its alredy assigned' })
      //update student mentor with checking mentor is exist or not
      const student_update = await Student.findOneAndUpdate(
        { admissionNumber: student },
        {
          $set: {
            mentor: Mentorid,

            status: 'true'
          }
        }
      )
      //update mentor and assign student
      const Mentor_update = await MentorSchema.findOneAndUpdate(
        { id: Mentorid },
        {
          $push: {
            students: student
          }
        }
      )
      //update reviou mentor
      if (previousMentor) {
        //pop student from array
        const Pop = await MentorSchema.findOneAndUpdate(
          { id: previousMentor },
          {
            $pull: {
              students: student
            }
          }
        )
        if (student_update && Mentor_update && Pop)
          return res.status(200).json({ message: 'all succees' })
          else return res.status(400).json({message:"not updated "})
      }

      if (student_update && Mentor_update)
        return res.status(200).json({ message: 'updated' })
      else return res.status(400).json({ message: 'not updated yet' })
    } else {
      // return student is not exist
      if (!Available_Student)
        return res.status(400).json({ message: 'student  not exis' })
      else return res.status(400).json({ message: 'mentor not exist' })
    }
  } catch (error) {
    console.log(error)
  }
}
//update the student with valid students came from middleware function
exports.UpdateValidStudents = async (req, res) => {
  try {
    const mentor = req.body.id
    const ValidStudents = req.valid
    console.log(mentor, ValidStudents)
    const UpdateArray = []
    await ValidStudents.map(async item => {
      let _update = await Student.findOneAndUpdate(
        { admissionNumber: item },
        {
          $set: {
            mentor: mentor,
            status: 'true'
          }
        }
      )
      UpdateArray.push(_update)
    })
    return res
      .status(200)
      .json({ message: 'all update success fully', UpdateArray })
  } catch (error) {
    console.log(error)
  }
}
