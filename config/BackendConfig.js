import ThirdPartyEmailPasswordNode from 'supertokens-node/recipe/thirdpartyemailpassword'
import SessionNode from 'supertokens-node/recipe/session'
import { appInfo } from './appInfo'
import PasswordValidation from '../component/PasswordValidation'

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
            id: "password",
            validate: async (value) => {
                PasswordValidation(value)
            }
          }]
       },
        providers: [
          ThirdPartyEmailPasswordNode.Google({
            clientId: "779912293360-3d9fghepkse27c8sg7mp8cmb6l8irgfn.apps.googleusercontent.com",
            clientSecret: "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"
          }),
          ThirdPartyEmailPasswordNode.Facebook({
            clientSecret: "12ddeee5ae56a0377da9f33c92a39e68",
            clientId: "1116382709219370",
          }),
        ],
      }),
      SessionNode.init(),
    ],
    isInServerlessEnv: true,
  }
}