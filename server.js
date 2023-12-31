const express = require('express')
const DBDAO = require('./dao')
const app = express()
const { check, validationResult } = require('express-validator')
let ejs = require('ejs')
app.set('view engine', 'ejs')
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 3004

//Home Page
app.get('/', (req, res) => {
    res.render("home");
})

//Stores

//Update a store & return user to /stores.
//Conditions: SID can't be edited, Location must be 1 character at least, Manager ID must be 4chars and must exist.

//Add a store, same conditions as above.


//Products

//Delete a product - can't delete if it's not in any store.


//Managers

//Add Manager - ID must be unique & at least 4chars, name must be at least 5chars, Salary must be >30000 & <70000


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

//Code Snippets
/*
Send user to students.ejs
    DBDAO.getStudents()
        .then((data) => {
            res.render("student", { "students": data }); 
        })
        .catch((error) => {
            console.log(error)
        });

//Delete a student from the db
app.get('/students/delete/:id', async (req, res) => {
 
   var found = 0;
    DBDAO.deleteStudent(req.params.id)
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


*/