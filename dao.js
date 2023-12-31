const pmysql = require('promise-mysql')
var pool;

// Database setup
pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'studentdb4'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("Pool Error: " + e)
    });


// Returns all of the students from the student_table in the database
var getStudents = function() {
    return new Promise((resolve, reject) => {
        pool.query('select * from student_table')
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// Deletes a student from the student_table
var deleteStudent = function(studentID) {
    var deletionQuery = {
        sql: 'delete from student_table where student_id=?',
        values: [studentID]
    }
    return new Promise((resolve, reject) => {
        pool.query(deletionQuery)
            .then((data) => {
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

module.exports = {getStudents, deleteStudent};