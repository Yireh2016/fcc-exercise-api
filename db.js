const mongoose =  require('mongoose');
const shortid = require('shortid')

mongoose.connect(`mongodb+srv://fcc-mongo-jainer:${process.env.DBPASSWD}@cluster0-8ebwi.mongodb.net/test?retryWrites=true&w=majority`,{ useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
  type: String,
  default: shortid.generate
},
  username:{ type: String, unique: true },
})

const exerciseSchema= new Schema({
  // userId(_id), description, duration, and optionally date
  _id: {
    type: String,
    default: shortid.generate
  },
  userId:{ type: String, required: true },
  description:{ type: String, required: true },
  duration:{ type: String, required: true },
  date: { type: Date }
})

const UserModel = mongoose.model('User', userSchema)
const ExerciseModel = mongoose.model("Exercise", exerciseSchema)

const addUser = (user) => new Promise((resolve,reject) => {
  
  let newUser= new UserModel(user)
  
  console.log("saving user", newUser)
  
  newUser.save((err,user)=>{
    
    if(err)reject(err)
    
    console.log('saved user', user)
    const { _id, username } = user
    resolve({ _id, username })
    
  })
  
  
})
const findUser = (queryObj)=> new Promise((resolve,reject) => {  
   UserModel.find(queryObj).exec((err,usernameArr)=>{
    
    if(err)reject(err)
   
    resolve(usernameArr)
  })
  

})
const addExercise=(exercise) => new Promise((resolve,reject) => {
  // userId(_id), description, duration, and optionally date
   console.log("exercise creating",exercise)
  let newExercise= new ExerciseModel(exercise);
   console.log("exercise saving",newExercise)
  newExercise.save((err,result) =>{
    if(err)reject(err)
    console.log("exercise saved",result)
    resolve(result)
  })
})
const getExercise=({userId,from,to,limit})=>new Promise((resolve,reject) =>{
 
  const getHandler= (err,exerciseArr) =>{
    if(err) reject(err)
    console.log("getted exercises",exerciseArr)
    resolve(exerciseArr)
    
    
  }  
  const _from=from?from:new Date("1970-01-01");
  const _to=to?to:new Date("2100-01-01");
  const _limit=limit?limit:0;
  ExerciseModel.find({userId}).where('date').gte(_from).lte(_to).limit(_limit).exec(getHandler)
})

module.exports = { addUser, findUser , addExercise , getExercise }