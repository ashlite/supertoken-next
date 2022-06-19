import React from 'react'
import AuthWrapper from '../../component/AuthWrapper' 
import { Box, Heading } from '@chakra-ui/react'
import UserProfile from './component/UserProfile'
import AllUserData from './component/AllUserData'

export default function Dashboard() {
  return (
    <AuthWrapper>
      <Box w="100%">
        <Heading as="h1" size="3xl" textAlign="center" my={4}>Dashboard</Heading>
        <UserProfile />
        <AllUserData />
      </Box>
    </AuthWrapper>
  )
}