var express = require('express');
const { Create_Student, Assign_Chgange_Mentor_For_Student } = require('../collections/student');
var router = express.Router();
const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
mongoose.connect(process.env.DB_URL)
mongoose.connection.once('open',()=>console.log("DataBase connected succesfully"))
.on('error', error => console.log('Database error Happens::::::', error))

/* GET home page. */
router.post('/create-student',Create_Student );
router.post('/add-update',Assign_Chgange_Mentor_For_Student)

module.exports = router;
