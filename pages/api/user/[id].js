import { deleteUser } from 'supertokens-node'
import UserMetadata from 'supertokens-node/recipe/usermetadata'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import Prisma from '../../../config/Prisma'

/**
 *  @swagger
 *  /api/user/{id}:
 *    delete:
 *      tags:
 *        - default
 *      summary: Delete a single user
 *      description: Delete the selected user data (all session include), then revoke all active session (login user will logout automatically) 
 *      responses:
 *        200:
 *          description: User deleted
 *        401:
 *          description: Unauthorized
 *        400:
 *          description: Bad Request
 *    patch:
 *      tags:
 *        - default
 *      summary: Update a username
 *      description: Update the username of the selected user
 *      requestBody:
 *        description: Send the new username in the request body
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                userName:
 *                  type: string
 *              required:
 *                - userName 
 *      responses:
 *        200:
 *          description: User updated
 *        400:
 *          description: Bad Request
 */

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
      res.status(400).json({message: err.message})
    }
  } else if (req.method === 'PATCH'){
    const data = req.body
    try{
      await UserMetadata.updateUserMetadata(id, { userName: data.userName })
      res.status(200).end()
    } catch(err) {
      console.log(err)
      res.status(400).send(err)
    }      
  }
}