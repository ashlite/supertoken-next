import React from 'react'
import dynamic from 'next/dynamic'
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword'

export const AuthWrapper = dynamic(
  new Promise((res) => {
    res(ThirdPartyEmailPasswordAuth)
  }),
  {ssr: false}
)

export default AuthWrapper