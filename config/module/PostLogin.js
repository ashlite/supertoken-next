import Prisma from "../Prisma"
import axios from 'axios'
import { RegisterUser, UpsertSession } from "./DBQuery"

export default async function PostLogin(data){
  let userProfile, dbInput, apiResponse
  console.log(data)

  if (data.createdNewUser) {

    //Get profile from thirdparty
    if (data.user.thirdParty.id == "google") {
      let url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${data.authCodeResponse.access_token}`
      try{
        apiResponse = await axios.get(url)
        userProfile = apiResponse.data
      } catch(err){
        console.log(err)
      }
    } else if (data.user.thirdParty.id == "facebook") {
      let url = `https://graph.facebook.com/me?access_token=${data.authCodeResponse.access_token}`
      try{
        apiResponse = await axios.get(url)
        userProfile = apiResponse.data
      } catch(err){
        console.log(err)
      }
    }
    //Add user to DB
    dbInput = await RegisterUser(data.user.id, data.user.email, userProfile.name, data.user.timeJoined)

  } else {
    //Add login log in DB
    // await addSessionDB()
    
  }
  return dbInput
}