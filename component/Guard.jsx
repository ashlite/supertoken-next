import React from 'react'
import dynamic from 'next/dynamic'
import { ThirdPartyEmailPasswordAuth } from "supertokens-auth-react/recipe/thirdpartyemailpassword"

const AuthWrapper = dynamic(
  new Promise((res) => res(ThirdPartyEmailPasswordAuth)),
  {ssr: false}
)

export default function Guard({children}) {
  return <AuthWrapper>{children}</AuthWrapper>
}