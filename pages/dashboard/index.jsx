import React from 'react'
import AuthWrapper from '../../component/AuthWrapper' 
import { Box, Heading } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <AuthWrapper>
      <Box>
        <Heading>Dashboard</Heading>
      </Box>
    </AuthWrapper>
  )
}