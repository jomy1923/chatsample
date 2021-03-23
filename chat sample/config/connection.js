const mongoClient = require('mongodb').MongoClient

const state = {
    db:null 
}

module.exports.connect = function(done){
  
    const dbname = 'chat'
   
    mongoClient.connect(process.env.MONGO_CONNECTION_URI,{ useUnifiedTopology: true },(err,data)=>{
        
        if(err) return done(err)
        state.db=data.db(dbname) 
        done()
    })
}
module.exports.get=function(){
    return state.db
}