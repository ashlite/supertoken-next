import { ChakraProvider } from '@chakra-ui/react'
import React from 'react'
import SuperTokensReact from 'supertokens-auth-react'
import { frontendConfig } from '../config/FrontendConfig'
import Layout from '../component/Layout'

if (typeof window !== 'undefined') {
  SuperTokensReact.init(frontendConfig())
}

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ChakraProvider>
  )
}

export default MyApp
