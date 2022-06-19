import React from 'react'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { Button } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'

Session.addAxiosInterceptors(axios)

export default function DestroyButton(){
  let {doesSessionExist, userId} = useSessionContext()
  const router = useRouter()

  async function destroy(e){
    e.preventDefault()
    const url = `/api/user/${userId}`
    await axios.delete(url)
    router.push('/')
  }

  return (
    <>
    {doesSessionExist && <Button w="full" size="lg" colorScheme="red" onClick={e => destroy(e)}>Delete Account</Button>} 
    </>
  )
}