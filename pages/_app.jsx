import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import SuperTokensReact from 'supertokens-auth-react'
import { frontendConfig } from '../config/FrontendConfig'
import Layout from '../component/Layout'
import theme from '../config/ChakraConfig'

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig())
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
