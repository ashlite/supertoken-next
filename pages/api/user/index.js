import Prisma from '../../../config/Prisma'

export default async function handler(req,res){
  const {name, superTokenId, email, signUpAt} = req.body
  let result
  if (req.method === 'POST'){
    result = await Prisma.user.create({
      data: {
        name: name,
        email: email,
        superTokenId: superTokenId.toString(),
        signUpAt: signUpAt
      }
    })
  }
  res.json(result)
}