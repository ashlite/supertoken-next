import React from "react"
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword"
import { useRouter } from 'next/router'
import { ThirdPartyEmailPasswordAuth } from 'supertokens-auth-react/recipe/thirdpartyemailpassword'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { Button } from '@chakra-ui/react'
import dynamic from 'next/dynamic'
import Guard from "./Guard"

// const SessionWrapper = dynamic(() => (ThirdPartyEmailPasswordAuth), {ssr: false})
// const SessionWrapper = dynamic(new Promise((res) => res(ThirdPartyEmailPasswordAuth), {ssr: false}))

export default function AuthButton(){
  let {doesSessionExist} = useSessionContext()
  console.log(doesSessionExist)
  const router = useRouter()

  function logout(e) {
    e.preventDefault()
    signOut().then(() => {
      router.push('/')
    })
  }
  
  function login(e){
    e.preventDefault()
    router.push('/auth')
  }

  return(
    <>
    {/* <Guard requiredAuth={false}> */}
      {doesSessionExist ? 
        <Button w="full" size="lg" colorScheme="red" onClick={e => logout(e)}>Logout</Button> 
      : 
        <Button w="full" size="lg" colorScheme="green" onClick={e => login(e)}>Sign-In / Sign-Up</Button>
      }
      <Button w="full" size="lg" colorScheme="red" onClick={e => logout(e)}>Logout</Button>
    {/* </Guard> */}
    </>
  )
}
