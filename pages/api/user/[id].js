import {deleteUser} from 'supertokens-node'
import UserMetadata from "supertokens-node/recipe/usermetadata"
import { superTokensNextWrapper } from "supertokens-node/nextjs"
import { verifySession } from "supertokens-node/recipe/session/framework/express"

export default async function handler(req,res){
  const {id} = req.query

  await superTokensNextWrapper(
    async (next) => {
      await verifySession()(req, res, next)
    },
    req,
    res,
  )

  if (req.method === 'DELETE'){
    await deleteUser(id)
  } else if (req.method === 'PATCH'){
    const data = req.body
    try{
      await UserMetadata.updateUserMetadata(id, { userName: data.userName })
      res.status(200)
    } catch(err) {
      console.log(err)
      res.status(500).send(err)
    }      
  }
}