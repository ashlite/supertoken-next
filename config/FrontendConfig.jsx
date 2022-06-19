import React, { useEffect } from 'react'
import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import SessionReact from 'supertokens-auth-react/recipe/session'
import { appInfo } from './AppInfo'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'

Session.addAxiosInterceptors(axios)

export function frontendConfig(){
  
  return {
    appInfo,
    recipeList: [
      ThirdPartyEmailPasswordReact.init({
        emailVerificationFeature: {
          mode: 'REQUIRED'
         },
        signInAndUpFeature: {
          providers: [
            ThirdPartyEmailPasswordReact.Google.init(),
            ThirdPartyEmailPasswordReact.Facebook.init(),
          ],
          signUpForm: {
            formFields: [{
              id: 'password',
              label: 'Password',
              
              validate: async(value) => {
                const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*^?&])[A-Za-z\d@#$!%*^?&]{8,20}$/
                if (regex.test(value)) {
                  return undefined
                } else {
                  return 'Password must be 8-20 characters long, contain at least one number, one uppercase letter, one lowercase letter, and one special character (@#$!%*^?&)'
                }
              }
            }, {
              id: 'passwordConfirm',
              label: 'Confirm your Password',
              placeholder: 'Please input your password again',

              validate: async(value) => {
                if (value !== document.querySelector('#supertokens-root').shadowRoot.querySelector('input[name="password"]').value) {
                  return 'Password does not match'
                }
                return undefined
              }
            }, { 
              id: 'name',
              label: 'Full Name',
              placeholder: 'First name and last name',
            }]
          }
        },
        override:{
          components:{
            EmailPasswordSignUpForm_Override:({DefaultComponent, ...props}) => {
              useEffect(() => {
                let passwordConfirm = document.querySelector('#supertokens-root').shadowRoot.querySelector('input[name="passwordConfirm"]')
                if (passwordConfirm){
                  passwordConfirm.setAttribute('type', 'password')
                }
              }, [])
              return <DefaultComponent {...props} />
            }
          }
        },
        getRedirectionURL: async (context) => {
          if (context.action === 'SUCCESS') {
              return '/dashboard';
          }
          return undefined;
        },
      }),
      SessionReact.init(),
    ],
  }
}