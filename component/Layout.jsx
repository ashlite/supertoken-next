import React from 'react'
import { Box, Grid, GridItem, Text, IconButton, useColorMode, DarkMode } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import AuthButton from './AuthButton'
import DestroyButton from '../component/DestroyButton'
import { SessionAuth } from 'supertokens-auth-react/recipe/session'
import dynamic from 'next/dynamic'

const SessionAuthNoSSR = dynamic(
  new Promise((res) => {
    res(SessionAuth)
  }),
  {ssr: false}
)

export default function Layout({ children }) {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
      <Box w="full">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} w="full" bgColor="#072AC8" p={6}>
          <GridItem w="full" colSpan={2}>
            <DarkMode>
              <Text textColor="grey.100" fontSize="4xl" >AHA-Test</Text>
            </DarkMode>
          </GridItem>
          <SessionAuthNoSSR requireAuth={false}>
            <>
            <GridItem w="full" colStart={8} colSpan={2}>
              <DestroyButton />
            </GridItem>
            <GridItem w="full" colStart={10} colSpan={2}>
              <AuthButton />
            </GridItem>
            </>
          </SessionAuthNoSSR>
          <GridItem colStart={12}>
            <IconButton 
              onClick={toggleColorMode}
              aria-label='Colormode switcher'
              size="lg"
              w="full"
              colorScheme="yellow" 
              icon={colorMode === 'light' ? <SunIcon /> : <MoonIcon />} 
            />              
          </GridItem>
        </Grid>
        {children}
      </Box>
  )
}