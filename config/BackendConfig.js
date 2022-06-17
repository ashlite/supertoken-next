import ThirdPartyEmailPasswordNode from 'supertokens-node/recipe/thirdpartyemailpassword'
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './AppInfo'
import { PrismaClient } from '@prisma/client'
import PostLogin from './module/PostLogin'

const prisma = new PrismaClient()

export function backendConfig(){
  return {
    framework: "express",
    supertokens: {
      connectionURI: process.env.SUPER_TOKEN_CONNECTION_URI,
      apiKey: process.env.SUPER_TOKEN_API_KEY,
    },
    appInfo,
    recipeList: [
      ThirdPartyEmailPasswordNode.init({
        signUpFeature: {
          formFields: [{
            id: "name"
          }, {
            id: "password",
            validate: async (value) => {
              const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
              if (regex.test(value)) {
                return undefined
              } else {
                return 'Password must be 8-20 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character'
              }
            }
          },{
            id: "passwordConfirm"
            
          }]
        },
        providers: [
          ThirdPartyEmailPasswordNode.Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_SECRET,
            scope:["profile", "email"]
          }),
          ThirdPartyEmailPasswordNode.Facebook({
            clientSecret: process.env.FACEBOOK_SECRET,
            clientId: process.env.FACEBOOK_CLIENT_ID,
            scope:["public_profile", "email"]
          }),
        ],
        override: {
          apis: (originalImplementation) => {
            return {
              ...originalImplementation,
              // override the email password sign up API
              emailPasswordSignUpPOST: async function(input) {
                if (originalImplementation.emailPasswordSignUpPOST === undefined) {
                    throw Error("Should never come here");
                }
                let response = await originalImplementation.emailPasswordSignUpPOST(input);
                console.log(response)
                console.log(input)
                if (response.status === "OK") {
                  // TODO: some post sign up logic
                  // let formFields = input.formFields
                }

                return response;
              },
              // override the email password sign in API
              emailPasswordSignInPOST: async function(input) {
                if (originalImplementation.emailPasswordSignInPOST === undefined) {
                  throw Error("Should never come here");
                }

                // TODO: some pre sign in logic

                let response = await originalImplementation.emailPasswordSignInPOST(input);

                if (response.status === "OK") {
                    // TODO: some post sign in logic
                }

                return response;
              },
              // override the thirdparty sign in / up API
              thirdPartySignInUpPOST: async function(input) {
                if (originalImplementation.thirdPartySignInUpPOST === undefined) {
                  throw Error("Should never come here");
                }
                let response = await originalImplementation.thirdPartySignInUpPOST(input);
                if (response.status === "OK") {
                  await PostLogin(response)                                 
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