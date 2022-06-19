import React from 'react'
import { useRouter } from 'next/router'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { Button } from '@chakra-ui/react'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'

Session.addAxiosInterceptors(axios)

export default function AuthButton(){
  let {doesSessionExist} = useSessionContext()
  const router = useRouter()

  async function logout(e) {
    e.preventDefault()
    try{
      await axios.post('/api/logout')
      router.push('/')
    } catch(err){console.log(err)}
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
