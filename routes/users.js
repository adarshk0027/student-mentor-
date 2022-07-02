var express = require('express');
const { createMentor, show_student_By_Mentor, Students_Not_Have_Mentor, Assign_Menter } = require('../collections/mentor');
const { UpdateValidStudents } = require('../collections/student');
var router = express.Router();

/* GET users listing. */
router.get('/',(req,res)=>{
    res.status(200).json({message:"welcome to my app"})
})
router.post('/create-mentor',createMentor);
router.get('/show-students',show_student_By_Mentor)
router.post('/assign-students',Students_Not_Have_Mentor,Assign_Menter,UpdateValidStudents)

module.exports = router;
