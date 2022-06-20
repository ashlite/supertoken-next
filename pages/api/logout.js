import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import Prisma from '../../config/Prisma'

/**
 * @swagger
 * /api/logout:
 *   post:
 *     tags:
 *       - default 
 *     summary: Logout the user
 *     description: Logout the current user, then update the session expiration in DB.
 *     responses:
 *       200:
 *         description: Success! User session revoked
 *       401:
 *         description: Unauthorized, you must login to see it working
 */

export default async function logout(req, res) {
  await superTokensNextWrapper(async (next) => {
      await verifySession()(req, res, next);
    }, req, res
  )
  if (req.method === 'POST') {
    let handle = await req.session.getHandle()
    await Prisma.session.update({
      where: {handleId: handle},
      data: {expiryAt: new Date()}
    })

    await req.session.revokeSession()
    res.status(200).send("Success! User session revoked")
  }
}