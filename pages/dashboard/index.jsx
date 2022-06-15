import Guard from '../../component/Guard'
import { Box, Heading } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Guard>
      <Box>
        <Heading>Dashboard</Heading>
      </Box>
    </Guard>
  )
}