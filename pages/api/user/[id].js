import { deleteUser } from 'supertokens-node'
import UserMetadata from 'supertokens-node/recipe/usermetadata'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import Prisma from '../../../config/Prisma'

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
    try{
      await Prisma.session.deleteMany({
        where: {userId: id},
      })
      await req.session.revokeSession()
      await deleteUser(id)
      res.status(200).json({message: 'User deleted'})
    } catch (err){
      console.log(err)
      res.status(500).json({message: err.message})
    }
  } else if (req.method === 'PATCH'){
    const data = req.body
    try{
      await UserMetadata.updateUserMetadata(id, { userName: data.userName })
      res.status(200).end()
    } catch(err) {
      console.log(err)
      res.status(500).send(err)
    }      
  }
}