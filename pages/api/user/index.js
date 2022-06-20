import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { verifySession } from 'supertokens-node/recipe/session/framework/express'
import { getUsersNewestFirst, getUserCount } from 'supertokens-node'
import Session from 'supertokens-node/recipe/session'
import UserMetadata from 'supertokens-node/recipe/usermetadata'
import Prisma from '../../../config/Prisma'

/**
 *  @swagger
 *  /api/user:
 *    get:
 *      summary: Return all users data
 *      description: Returning all user data and session data without any parameter and request body.
 *      responses:
 *        200:
 *          description: Object users
 *          content:
 *            application/json:
 *              schema: 
 *                type: object
 *                properties:
 *                  users:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        email:
 *                          type: string
 *                        id:
 *                          type: string
 *                        timeJoined:
 *                          type: string
 *                          format: date-time
 *                        userName:
 *                          type: string
 *                        totalLogin:
 *                          type: integer
 *                        session:
 *                          type: string
 *                        lastSession:
 *                          type: string
 *                          format: date-time   
 *                  userCount:
 *                    type: integer
 *                  todaySession:
 *                    type: integer
 *                  lastWeekSession:
 *                    type: integer    
 */

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
    var todaySession = 0

    const lastWeekSession = await Prisma.session.count({
      where: {
        createAt:{
          gte: new Date(Date.now() - 7*24*60*60*1000),
          lte: new Date()
        }
      }
    })

    for (let user of usersResponse.users){
      const result ={}
      const { metadata } = await UserMetadata.getUserMetadata(user.user.id)
      result.email = user.user.email
      result.id = user.user.id
      result.timeJoined = user.user.timeJoined
      result.userName = metadata.userName
      result.totalLogin = metadata.totalLogin
      result.session = await Session.getAllSessionHandlesForUser(user.user.id)
      if (result.session.length > 0){
        todaySession += 1
      }
      result.lastSession = await Prisma.session.findFirst({
        where:{userId: user.user.id},
        orderBy: {createAt: 'desc'},
      })
      users.push(result)
    }
    let userCount = await getUserCount()
    res.status(200).json({users: users, userCount: userCount, todaySession: todaySession, lastWeekSession: lastWeekSession})
  }
}