import Prisma from "../Prisma"
let result

export async function RegisterUser(stId, email, name, date){
  try{
    result = await Prisma.user.create({
      data: {
        name: name,
        email: email,
        superTokenId: stId,
        signUpAt: new Date(data.user.timeJoined)
      }
    })
  } catch(err) {console.log(err)}
  return result
}

// export async function PostEmailLogin(id){
//   try{
//     await Prisma.login.create({
//       data: {
//         superTokenId: id
//       }
//     })
//   } catch(err) {console.log(err)}
// }

export async function UpsertSession(stId, handleID, expire){
  try{
    await Prisma.session.upsert({
      where: {handleId: handleID},
      update: {sessionEnd: new Date(expire)},
      create:{
        superTokenId: stId,
        handleId: handleID,
        sessionEnd: new Date(expire)
      }
    })
  } catch(err) {console.log(err)}
}
