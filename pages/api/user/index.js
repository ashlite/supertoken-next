import { superTokensNextWrapper } from "supertokens-node/nextjs"
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import { getUsersNewestFirst, getUserCount } from "supertokens-node"
import Session from "supertokens-node/recipe/session"
import UserMetadata from "supertokens-node/recipe/usermetadata"

export default async function handler(req,res){
  await superTokensNextWrapper(
    async (next) => {
      await verifySession()(req, res, next)
    },
    req,
    res,
  )
  
  if (req.method === 'GET'){
    let usersResponse = await getUsersNewestFirst({
      limit:200,
    })    
    const users = []
    for (let user of usersResponse.users){
      const result ={}
      const { metadata } = await UserMetadata.getUserMetadata(user.user.id)
      result.email = user.user.email
      result.id = user.user.id
      result.timeJoined = user.user.timeJoined
      result.userName = metadata.userName
      result.totalLogin = metadata.totalLogin
      result.session = await Session.getAllSessionHandlesForUser(user.user.id)
      // console.log(result)
      users.push(result)
      // console.log(users)
    }

    console.log(users)
    let userCount = await getUserCount()
    // let userSession = await Session.getAllSessionHandlesForUser(req.user.id)
    res.status(200).json({users: users, userCount: userCount})
  }
}