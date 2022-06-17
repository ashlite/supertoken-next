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
      connectionURI: "https://185b8161eb9411eca72be755308ae527-us-east-1.aws.supertokens.io:3568",
      apiKey: "8Wn0rGPVaZVQcWV34vGvdSfs7k9HHt",
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
            clientId: "779912293360-3d9fghepkse27c8sg7mp8cmb6l8irgfn.apps.googleusercontent.com",
            clientSecret: "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",
            scope:["profile", "email"]
          }),
          ThirdPartyEmailPasswordNode.Facebook({
            clientSecret: "12ddeee5ae56a0377da9f33c92a39e68",
            clientId: "1116382709219370",
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