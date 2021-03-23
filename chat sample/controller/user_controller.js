var db = require('../config/connection')
var collection = require('../config/collection')
var obectId = require('mongodb').ObjectID
var bcrypt = require('bcrypt')
const { render } = require('../app')
module.exports = {
    userRegister: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.password = await bcrypt.hash(userData.password, 10)

            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                if (data) {
                    console.log('deatails of user', data.ops[0]);
                    resolve(data.ops[0])
                }
                else {
                    reject()
                }
            })
        })
    },
    userIdExists: (username) => {
        console.log("username in userIdExists:", username);
        return new Promise(async (resolve, reject) => {
            let uname = await db.get().collection(collection.USER_COLLECTION).findOne({ username: username })
            if (uname) {
                resolve(uname)
            } else {
                reject()
            }
        })

    },
    userLogin:(userData)=>{
      console.log('userdata in login',userData);
      
        return new Promise(async(resolve,reject)=>{
            let loginStatus=false
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({username:userData.username})
            console.log('user is',user);
            
            if(user){
                console.log('im in');
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    console.log('status',status);
                    if(status){
                        response.user=user
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        response.invalidUser=true
                        reject(response)
                    }
                })
            }else{
                console.log('login faileddd')
                response.invalidUser=true
                reject(response)
            }
        })
        
        
    },
    getAllUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users=await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    }

}
