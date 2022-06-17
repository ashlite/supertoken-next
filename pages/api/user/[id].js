import Prisma from '../../../config/Prisma'
import {deleteUser} from 'supertokens-node'

export default async function handler(req,res){
  const {id} = req.query
  if (req.method === 'DELETE'){
    await deleteUser(id)
    await Prisma.user.delete({
      where: {
        superTokenId: id.toString()
      }
    })
  }
  res.json({})
}