import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Session from 'supertokens-auth-react/recipe/session'
import { 
  Box,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Heading,
} from '@chakra-ui/react'

Session.addAxiosInterceptors(axios)

export default function AllUserData(){
  const [data, setData] = useState()
  useEffect(() => {
    axios.get(`api/user`)
    .then(res => {
      setData(res.data)
    })
    .catch(err => console.log(err))
  },[])
  console.log(data)
  
  return(
    <Box w="80%" mx="auto" p={6}>
      <Heading my={4} textAlign="center">Data User</Heading>
      <Flex direction="row">
        <Stat>
          <StatLabel>Total User</StatLabel>
          <StatNumber>{data ? data.userCount : "Loading..."}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Today Active Sessions</StatLabel>
          <StatNumber>{data ? data.todaySession : "Loading..."}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Average Active User</StatLabel>
          <StatNumber>{data ? data.lastWeekSession : "Loading..."}</StatNumber>
          <StatHelpText>Last 7 days</StatHelpText>
        </Stat>
      </Flex>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Register Date</Th>
              <Th>Last Session</Th>
              <Th isNumeric>Total Login</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.users.map((user, index) =>
              <Tr key={index}>
                <Td>{user.email}</Td>
                <Td>{new Date(user.timeJoined).toLocaleDateString()}</Td>
                <Td>{new Date(user.lastSession.createAt).toLocaleDateString()}</Td>
                <Td isNumeric>{user.totalLogin}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  )
}