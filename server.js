const express = require('express')
const SQLDAO = require('./dao')
const app = express()
const { check, validationResult } = require('express-validator')
let ejs = require('ejs')
app.set('view engine', 'ejs')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3004


app.get('/', (req, res) => {
    SQLDAO.getStudents()
        .then((data) => {
            res.render("student", { "students": data }); //The render line sends the user to the student.ejs
        })
        .catch((error) => {
            console.log(error)
        });
})

app.get('/students/delete/:id', async (req, res) => {
    var found = 0;

    //Deleting the Student
    SQLDAO.deleteStudent(req.params.id)
        .then((data) => {
            if(data.affectedRows == 1)
                res.send("Student:"+req.params.id+" deleted!");
            else(data.affectedRows == 0)
                res.send("Student: "+req.params.id+" not found!")
        })
        .catch((error) => {
            console.log(error);
            if (error.errno == 1451) {
                res.send("Student could not be deleted!")
                found = 1;
            }
        });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})