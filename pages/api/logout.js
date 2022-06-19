import { superTokensNextWrapper } from 'supertokens-node/nextjs'
import { verifySession } from "supertokens-node/recipe/session/framework/express"
import Prisma from '../../config/Prisma'

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