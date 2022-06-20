import React from 'react'
import { createSwaggerSpec } from 'next-swagger-doc'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorMode
} from '@chakra-ui/react'

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false });

function ApiDoc({spec}) {
  const {colorMode} = useColorMode()
  return (
    <>
    {colorMode === 'dark' && 
      <Alert status='warning'>
        <AlertIcon />
        <AlertTitle>Use Light Mode for better reading experience.</AlertTitle>
        <AlertDescription>
          Click the moon button to change it to light mode. Swagger ui does not support third party dark mode
        </AlertDescription>
      </Alert>
    }
    <SwaggerUI spec={spec} />
    </>
  ) 
}

export const getStaticProps = async () => {
  const spec = createSwaggerSpec({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Aha Test Documentation',
        description: 'Please use light mode for better viewing.',
        version: '0.1',
      },
      tags: [{
        name: 'default',
        description: 'Everything aplicabble in the app'
      },{
        name: 'auth',
        description: 'For Supertoken Authentication',
        externalDocs: {
          description: 'Documentation can be found here',
          url: 'https://supertokens.com/docs/thirdpartyemailpassword/testing/testing-with-postman'
        }
      }],
    },
    apiFolder: 'pages/api',
  })

  return {
    props: {
      spec,
    },
  }
}

export default ApiDoc