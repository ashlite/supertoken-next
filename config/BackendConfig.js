import ThirdPartyEmailPasswordNode from 'supertokens-node/recipe/thirdpartyemailpassword'
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './AppInfo'
import UserMetadata from 'supertokens-node/recipe/usermetadata'
import axios from 'axios'
import Prisma from './Prisma'

export function backendConfig(){
  return {
    framework: 'express',
    supertokens: {
      connectionURI: process.env.SUPER_TOKEN_CONNECTION_URI,
      apiKey: process.env.SUPER_TOKEN_API_KEY,
    },
    appInfo,
    recipeList: [
      UserMetadata.init(),
      ThirdPartyEmailPasswordNode.init({
        signUpFeature: {
          formFields: [{
            id: 'name'
          }, {
            id: 'password',
            validate: async (value) => {
              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*^?&])[A-Za-z\d@#$!%*^?&]{8,20}$/
              if (regex.test(value)) {
                return undefined
              } else {
                return 'Password must be 8-20 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character (@#$!%*^?&)'
              }
            }
          },{
            id: 'passwordConfirm'
            
          }]
        },
        providers: [
          ThirdPartyEmailPasswordNode.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            scope:['profile', 'email']
          }),
          ThirdPartyEmailPasswordNode.Facebook({
            clientSecret: process.env.FACEBOOK_SECRET,
            clientId: process.env.FACEBOOK_CLIENT_ID,
            scope:['public_profile', 'email']
          }),
        ],
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              // override the email password sign up API
              emailPasswordSignUpPOST: async function(input) {
                if (originalImplementation.emailPasswordSignUpPOST === undefined) {
                    throw Error('Should never come here');
                }
                let response = await originalImplementation.emailPasswordSignUpPOST(input);
                if (response.status === 'OK') {
                  var tempUser
                  for (let field of input.formFields){
                    if (field.id === 'name') {
                      tempUser = field.value
                      await UserMetadata.updateUserMetadata(
                        response.user.id,
                        { userName: tempUser, totalLogin: 1 }
                      )
                    }
                  }
                  let currTokenPayload = response.session.getAccessTokenPayload()
                  await response.session.updateAccessTokenPayload({
                    userName: tempUser,
                    email: response.user.email, 
                    ...currTokenPayload
                  })

                  await Prisma.session.upsert({
                    where: {handleId: response.session.sessionHandle},
                    create: {
                      handleId: response.session.sessionHandle,
                      userId: response.user.id,
                      createAt: new Date(await response.session.getTimeCreated()),
                      expiryAt: new Date(await response.session.getExpiry()),
                    },
                    update: {
                      expiryAt: new Date(await response.session.getExpiry()),
                    }
                  })
                }

                return response;
              },
              // override the email password sign in API
              emailPasswordSignInPOST: async function(input) {
                if (originalImplementation.emailPasswordSignInPOST === undefined) {
                  throw Error('Should never come here');
                }
                let response = await originalImplementation.emailPasswordSignInPOST(input);
                if (response.status === 'OK') {
                  const {metadata} = await UserMetadata.getUserMetadata(response.user.id)
                  let userName = metadata.userName
                  await UserMetadata.updateUserMetadata(response.user.id, { totalLogin: metadata.totalLogin + 1 })
                  let currTokenPayload = response.session.getAccessTokenPayload()
                  await response.session.updateAccessTokenPayload({
                    userName: userName,
                    email: response.user.email, 
                    ...currTokenPayload
                  })

                  await Prisma.session.upsert({
                    where: {handleId: response.session.sessionHandle},
                    create: {
                      handleId: response.session.sessionHandle,
                      userId: response.user.id,
                      createAt: new Date(await response.session.getTimeCreated()),
                      expiryAt: new Date(await response.session.getExpiry()),
                    },
                    update: {
                      expiryAt: new Date(await response.session.getExpiry()),
                    }
                  })
                }

                return response;
              },
              // override the thirdparty sign in / up API
              thirdPartySignInUpPOST: async function(input) {
                if (originalImplementation.thirdPartySignInUpPOST === undefined) {
                  throw Error('Should never come here');
                }
                
                let userName, apiResponse
                let response = await originalImplementation.thirdPartySignInUpPOST(input)
                if (response.status === 'OK') {

                  if (response.createdNewUser) {
                    //Get profile from thirdparty
                    if (response.user.thirdParty.id == 'google') {
                      let url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${response.authCodeResponse.access_token}`
                      try{
                        apiResponse = await axios.get(url)
                        userName = apiResponse.data.name
                      } catch(err){
                        console.log(err)
                      }
                    } else if (response.user.thirdParty.id == 'facebook') {
                      let url = `https://graph.facebook.com/me?access_token=${response.authCodeResponse.access_token}`
                      try{
                        apiResponse = await axios.get(url)
                        userName = apiResponse.data.name
                      } catch(err){
                        console.log(err)
                      }
                    }
                    await UserMetadata.updateUserMetadata(response.user.id, { userName: userName, totalLogin:1 })
                  } else {                                        
                    const {metadata} = await UserMetadata.getUserMetadata(response.user.id)
                    userName = metadata.userName
                    await UserMetadata.updateUserMetadata(response.user.id, { totalLogin: metadata.totalLogin + 1 })
                  }

                  let currTokenPayload = response.session.getAccessTokenPayload()
                  await response.session.updateAccessTokenPayload({
                    userName: userName,
                    email: response.user.email, 
                    ...currTokenPayload
                  })

                  await Prisma.session.upsert({
                    where: {handleId: response.session.sessionHandle},
                    create: {
                      handleId: response.session.sessionHandle,
                      userId: response.user.id,
                      createAt: new Date(await response.session.getTimeCreated()),
                      expiryAt: new Date(await response.session.getExpiry()),
                    },
                    update: {
                      expiryAt: new Date(await response.session.getExpiry()),
                    }
                  })
                }
                return response;
              }
            }
          }
        }
      }),
      SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}