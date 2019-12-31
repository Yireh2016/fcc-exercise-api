let { addUser , findUser, addExercise , getExercise } = require("./db.js")

const formatUserArr =(arr)=>{
      const result = [];
      arr.forEach( user =>{
        const { username , _id } = user
        result.push({ username , _id })
      })
      return result
    }

const createUser = (req,res) =>{
  // post to api/exercise/new-user
  const { username } = req.body;
  
 const _addUser=async() => { 
   try{
    const addUserRes = await addUser({username});
     res.json(addUserRes)
  }catch(err){
    res.json(err)
  }
 }
 
  _addUser({username})
}

const getAllUsers = (req,res) =>{
  //get api/exercise/users
  const _findUser= async()=>{
   try{
    const findUSerRes = await findUser({})
    console.log("found user(s)", findUSerRes)
    res.json(formatUserArr(findUSerRes))
   } catch(err){
     res.json(err)
   }
  }
  
  _findUser();
}

const addNewExercise = (req,res) =>{
  // post /api/exercise/add
  // userId(_id), description, duration, and optionally date
  let { userId, description, duration, date } = req.body;
  
  if(!date){
    date = new Date()
  }else{
    date=new Date(date)
  }
  const _addExercise = async()=>{
    try{
      
      const findUserRes = await findUser({_id:userId})
      
      if(findUserRes.length === 0){
        res.json({error: 'incorrect user id'})
        return
      }
      
      const exerciseRes = await addExercise({ userId, description, duration, date });
      const { username } = findUserRes[0];
      let  { _id } = exerciseRes; 
      res.json({ username, _id, description, duration , date:date.toString().match(/^[a-z]{3}\s[a-z]{3}\s\d{2}\s\d{4}/i)[0]   })
    }catch(err){
      console.log('error adding exercise',err)
      res.json(err)
    }
  }
  _addExercise()
}

const getExerciseLog =(req,res) =>{
  const { userId, from , to , limit } = req.query
  
  const _getExercise=async(exercise)=>{
    try{
      const getExerciseRes = await getExercise(exercise)
      
      console.log("getted exercises", getExerciseRes)
      const findUserRes = await findUser({_id:userId})
      const username = findUserRes[0].username
      
      res.json({username, userId, log:getExerciseRes})
    }catch(err){
      console.log("error getting exercises", err)
      res.json(err)
    }
  }
  _getExercise({ userId, from , to , limit })
}

module.exports = { createUser , getAllUsers , addNewExercise , getExerciseLog }