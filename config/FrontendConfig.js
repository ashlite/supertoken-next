import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './AppInfo'
import PasswordValidation from '../component/PasswordValidation'

export function frontendConfig(){
  return {
    appInfo,
    recipeList: [
      ThirdPartyEmailPasswordReact.init({
        emailVerificationFeature: {
          mode: "REQUIRED"
         },
        signInAndUpFeature: {
          providers: [
            ThirdPartyEmailPasswordReact.Google.init(),
            ThirdPartyEmailPasswordReact.Facebook.init(),
          ],
          signUpForm: {
            formFields: [{
              id: "password",
              label: "Password",
              
              validate: async(value) => {
                PasswordValidation(value)
              }
            }, {
              id: "passwordConfirm",
              label: "Confirm your Password",
              placeholder: "Please input your password again",

              validate: async(value) => {
                if (value !== password) {
                  return "Password does not match"
                }
                return undefined
              }
            }, { 
              id: "name",
              label: "Full Name",
              placeholder: "First name and last name",
            }]
          }
        },
        getRedirectionURL: async (context) => {
          if (context.action === "SUCCESS") {
              return "/dashboard";
          }
          return undefined;
      }
      }),
      SessionReact.init(),
    ],
  }
}