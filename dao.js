const pmysql = require('promise-mysql')
const mongo = require('mongodb').MongoClient
var pool;



///MONGODB
mongo.connect('mongodb://127.0.0.1:27017')
    .then((client) => {
        db = client.db('proj2023MongoDB')
        coll = db.collection('managers')
    })
    .catch((error) => {
        console.log(error.message)
    })

//Get Managers from MongoDB
var getManagers = function() {
    return new Promise((resolve, reject) => {
        var cursor = coll.find()
        cursor.toArray()
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Add a manager to the database.
var addManager = function(manager) {
    return new Promise((resolve, reject) => {
        coll.insertOne(manager)
            .then((documents) => {
                resolve(documents)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var checkManager = async function(manager) {
    await isManagerAssigned(manager)
    .then(async (data) => {
        console.log(data);
        if(data.length > 0)  {
            //Manager is currently assigned
            return false;
        }
        else if(data.length == 0) {
            //Manager is not currently assigned, but we don't know if they exist yet.
            count = await coll.count({_id: "M006"})
            console.log(count)
            if(count > 2) //exists!
                return true;
            else //doesn't!
                return false;
        }
    })
    .catch((error) => {
        console.log(error);
        if (error.errno == 1451) {
            res.send("Student could not be deleted!")
            found = 1;
        }
    });
}



///MYSQL
pmysql.createPool({
    connectionLimit: 3,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proj2023'
})
    .then(p => {
        pool = p
    })
    .catch(e => {
        console.log("Pool Error: " + e)
    });


//Get Stores
var getStores = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from store')
            .then((data) => {
                console.log(data)
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

//Edit Store
var editStore = function (storeID, location, mgrid) {
    var editQuery = {
        sql: 'update store set location=?, mgrid=?, where sid=?',
        values: [location, mgrid, storeID]
    }
    return new Promise((resolve, reject) => {
        pool.query(editQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//Get Products
var getProducts = function () {
    return new Promise((resolve, reject) => {
        pool.query('select * from product')
            .then((data) => {
                console.log(data)
                resolve(data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// Deletes a product from the product table.
var deleteProduct = function (productID) {
    var deletionQuery = {
        sql: 'delete from product where pid=?',
        values: [productID]
    }
    if(checkProduct(productID))
        return new Promise((resolve, reject) => {
            pool.query(deletionQuery)
                .then((data) => {
                    resolve(data)
                })
                .catch(error => {
                    reject(error)
                })
        })
    else
        return new Promise((resolve, reject) => {
            reject("Not found!")
        })
}

//Checks for a product's existence in the product_store - ie, is the product on shelves?
var checkProduct = function (productID) {
    var checkQuery = {
        sql: 'select * from product_store where pid=?',
        values: [productID]
    }
    return new Promise((resolve, reject) => {
        pool.query(checkQuery)
            .then((data) => {
                console.log("Checking: "+data)
                resolve(data)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

var isManagerAssigned = function(manager) {
    var checkQuery = {
        sql: 'select * from store where mgrid=?',
        values: [manager]
    }
    return new Promise((resolve,reject) => {
        pool.query(checkQuery)
            .then((data) => {
                resolve(data)
            })
            .catch((error) => {
                console.log(error);
                reject(error)
            })
    })
}

module.exports = { getManagers, addManager, getStores, editStore, getProducts, deleteProduct, checkManager };