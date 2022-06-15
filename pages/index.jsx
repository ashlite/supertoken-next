import React from 'react'
import {Text, Center, VStack} from '@chakra-ui/react'

export default function Home() {
  return (
    <Center w="full" h="100vh">
      <VStack>
        <Text 
          fontSize='6xl'
          fontWeight='extrabold' 
          bgGradient="linear(to-r, green.300, red.600)" 
          bgClip="text"
        >
          Welcome dear guest to AHA-Test app
        </Text>
        <Text>To start, please Sign In / Register by pressing the button in the top right corner</Text>
      </VStack>
    </Center>
  )
}
