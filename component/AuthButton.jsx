import React from "react"
import { signOut } from "supertokens-auth-react/recipe/thirdpartyemailpassword"
import { useRouter } from 'next/router'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { Button } from '@chakra-ui/react'

export default function AuthButton(){
  let {doesSessionExist} = useSessionContext()
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
    {doesSessionExist ? 
      <Button w="full" size="lg" colorScheme="red" onClick={e => logout(e)}>Logout</Button> 
    :
      <Button w="full" size="lg" colorScheme="green" onClick={e => login(e)}>Sign-In / Sign-Up</Button>
    }
    </>
  )
}
