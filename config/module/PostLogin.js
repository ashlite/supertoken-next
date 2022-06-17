import Prisma from "../Prisma"
import axios from 'axios'


export default async function PostLogin(data){
  let userProfile, dbInput, accessToken, apiResponse
  console.log(data)

  async function addLoginDB(){
    try{
      await Prisma.login.create({
        data: {
          superTokenId: data.user.id
        }
      })
    } catch(err) {console.log(err)}
  }

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
    try{
      dbInput = await Prisma.user.create({
        data: {
          name: userProfile.name,
          email: data.user.email,
          superTokenId: data.user.id,
          signUpAt: new Date(data.user.timeJoined).toJSON()
        }
      })
    } catch(err) {console.log(err)}
    addLoginDB()

  } else {
    //Add login log in DB
    await addLoginDB()
    
  }
  return dbInput
}