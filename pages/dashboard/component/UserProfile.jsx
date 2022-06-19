import React, { useState } from 'react'
import { useSessionContext } from 'supertokens-auth-react/recipe/session'
import { 
  Flex, 
  Spacer, 
  Box, 
  Text, 
  Button, 
  useDisclosure, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  ModalOverlay,
  Input,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'

Session.addAxiosInterceptors(axios)

export default function UserProfile() {
  let sessionContext = useSessionContext()
  const toast = useToast()
  const [newUserName, setNewUserName] = useState('')
  const [processingRequest, setProcessingRequest] = useState(false)
  const {isOpen, onOpen, onClose} = useDisclosure()

  function updateUsername(){
    setProcessingRequest(true)
    axios.patch(`api/user/${sessionContext.userId}`, {
      userName: newUserName
    })
    .then(res => {
      setNewUserName('')
      setProcessingRequest(false)
      onClose()
      if (res.status === 200){
        toast({
          title: 'Successfully updated username',
          description: 'Please relogin to see the changes',
          status: 'success',
          duration: 9000,
          isClosable: true,
        })
      } else if (res.status === 500) {
        toast({
          title: 'Failed to update username',
          status: 'danger',
          isClosable: true,
        })
      }
    })
    .catch(err => {console.log(err)})
  }

  return(
    <>
    <Flex w="60%" mx="auto" border="4px" borderColor="gray.100" borderRadius="lg" p={4} direction="row">
      <Box>
        <Text mb={4} fontSize="md">Hi {sessionContext.accessTokenPayload.userName} !</Text>
        <Text fontSize="md">Email : {sessionContext.accessTokenPayload.email}</Text>
      </Box>
      <Spacer />
      <Button colorScheme="teal" size="xl" w="25%" onClick={onOpen}>Update Username</Button>
    </Flex>

    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change your username</ModalHeader>
        {processingRequest ? 
          <Spinner size="xl" mx="auto" my={4} />
        :
          <>
          <ModalBody>
            <Input placeholder="New username" size="lg" value={newUserName} onChange={e => setNewUserName(e.target.value)}/>
          </ModalBody>
          <ModalFooter>
            <Button mr={4} colorScheme="yellow" size="lg" onClick={onClose}>Cancel</Button>
            <Button colorScheme="green" size="lg" onClick={updateUsername}>Save</Button>
          </ModalFooter>
          </>
        }
      </ModalContent>
    </Modal>
    </>
  )
}