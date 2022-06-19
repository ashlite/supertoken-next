import React from "react"
import { Box, Grid, GridItem, Text, Button } from "@chakra-ui/react"
import AuthButton from "./AuthButton"
import AuthWrapper from "./AuthWrapper"
import DestroyButton from "../component/DestroyButton"
import { SessionAuth } from "supertokens-auth-react/recipe/session"
import dynamic from "next/dynamic"

const SessionAuthNoSSR = dynamic(
  new Promise((res) => {
    res(SessionAuth)
  }),
  {ssr: false}
)

export default function Layout({ children }) {
  return (
      <Box w="full">
        <Grid templateColumns="repeat(5, 1fr)" gap={4} w="full" bgColor="#072AC8" p={6}>
          <GridItem w="full">
            <Text textColor="grey.100" fontSize="4xl" >AHA-Test</Text>
          </GridItem>
          <SessionAuthNoSSR requireAuth={false}>
            <>
            <GridItem w="full" colStart={4}>
              <DestroyButton />
            </GridItem>
            <GridItem w="full" colStart={5}>
              <AuthButton />
            </GridItem>
            </>
          </SessionAuthNoSSR>
        </Grid>
        {children}
      </Box>
  )
}