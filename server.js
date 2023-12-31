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
app.get('/stores', (req, res) => {
    DBDAO.getStores()
        .then((data) => {
            res.render("stores", { "stores": data });
        })
        .catch((error) => {
            console.log(error)
        });
})

//Update a store & return user to /stores.
//Conditions: SID can't be edited, Location must be 1 character at least, Manager ID must be 4chars and must exist.
app.get('/stores/edit/:sid', (req, res) => {
    res.render("editStore", { errors: undefined, sid: req.params.sid });
})
app.post('/stores/edit/:sid',
    [
        check("location").isLength({ min: 1 }).withMessage("Please enter a location."),
        check("mgrid").isLength({ min: 4, max: 4 }).withMessage("Manager ID must be 4 characters."),
        check("mgrid").custom(mgrid => { //Checks if the manager exists and is unassigned.
            console.log(mgrid);
            DBDAO.checkManager(mgrid)
            .then((count) => {
                if(count > 0) {
//i give up for now
                }
                else {
                    throw new Error("Manager must exist and be currently unassigned!")
                }
            })
            .catch((error) => {
                console.log(error);
                throw new Error("Manager must exist and be currently unassigned!")
            })

        })
    ], (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.render("editStore", { errors: errors.errors, sid: req.params.sid });
        }
        else {
            DBDAO.editStore( req.params.storeID, req.params.location, req.params.mgrid)
                .then((data) => {
                    if (data.affectedRows == 1)
                        res.send("Store " + req.params.storeID + " edited succesfully!");
                    else (data.affectedRows == 0)
                    res.send("Store " + req.params.storeID + " not found!")
                })
                .catch((error) => {
                    console.log(error);
                });
            res.send("Employee added!")
        }
    })

//Products
app.get('/products', (req, res) => {
    res.render("products");
})

//Delete a product - can't delete if it's not in any store.


//Managers
app.get('/managers', (req, res) => {
    DBDAO.getManagers()
        .then((data) => {
            res.render("managers", { "managers": data });
        })
        .catch((error) => {
            console.log(error)
        });
})

//Add Manager - ID must be unique & at least 4chars, name must be at least 5chars, Salary must be >30000 & <70000
app.get('/managers/add', (req, res) => {
    res.render("addManager", { errors: undefined});
})

app.post('/managers/add',
    [
        check("mgrid").isLength({min:4, max:4}).withMessage("ID must be 4 characters."),
        check("name").isLength({min:5}).withMessage("Name must be at least 5 characters."),
        check("salary").isNumeric({min:30000,max:70000}).withMessage("Salary must be between 30,000 and 70,000."),
        check("mgrid").custom(mgrid => {
            DBDAO.searchManager(mgrid)
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            })
        })
    ], (req, res) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()) {
            res.render("addEmployee",{errors:errors.errors});
        }
        else {
            var newManager = {_id: req.body.mgrid, name: req.body.name, salary: req.body.salary};
            DBDAO.addManager()
            .then((data) => {
                res.redirect("/managers");
            })
            .catch((error) => {
                console.log(error)
            });
        }
})

app.listen(port, async () => {
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