import React, { useState } from 'react'
import {
  Card,
  Avatar,
  Text,
  Progress,
  Badge,
  Group,
  ActionIcon,
  Grid,
  Button,
} from '@mantine/core'
import { IconShield } from '@tabler/icons-react'
import io from 'socket.io-client'
import { useCookies } from 'react-cookie'

const AllSOS = () => {
  const [cookies] = useCookies(['user_id'])
  const socket = io('https://withU.adityarai16.repl.co', {
    transports: ['websocket'],
  })

  const [sosList, setSosList] = useState([])
  const [acceptedList, setAcceptedList] = useState([])

  socket.on('connect', async () => {
    console.log('connected')
    socket.emit('Get_SOS_Officials', cookies.user_id, (data) => {
      console.log(data)
      setSosList(data)
    })
  })
  socket.on('Refetch_SOS_Details', () => {
    socket.emit('Get_SOS_details', cookies.user_id, (data) => {
      setSosList(data)
    })
  })

  socket.on('connect_error', (err) => {
    console.log(err)
  })

  const data = [
    {
      name: 'Name1',
      phone: '1234567890',
      location: 'Location1',
      time: '11:00:23 AM',
    },
    {
      name: 'Name2',
      phone: '1234567890',
      location: 'Location1',
      time: '11:00:23 AM',
    },
    {
      name: 'Name3',
      phone: '1234567890',
      location: 'Location1',
      time: '11:00:23 AM',
    },
  ]
  const GetDirection = (user_id, sos_user_id) => {
    if (!socket.connected) {
      alert('Please Connect to Internet')
      return
    }
    socket.emit('SOS_Accepted_Officials', cookies.user_id, sos_user_id)
    socket.emit('Get_SOS_Location', user_id, async (location) => {
      console.log(location)
      const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=walking`
    })
  }
  return (
    <div>
      <Grid gutterXl={30}>
        {data.map((item) => {
          const { name, phone, location, time } = item

          return (
            <Grid.Col span={4}>
              <Card withBorder padding="lg" radius="md">
                <Group position="apart">
                  <div className="avatar">
                    <IconShield />
                  </div>
                  <Badge color="pink" p={5}>
                    {time}
                  </Badge>
                </Group>
                <Text fz="lg" fw={500} mt="lg">
                  {name}
                </Text>
                <Text fz="sm" c="dimmed" mt={5}>
                  {phone}
                </Text>
                <Text c="dimmed" fz="sm" mt="md">
                  Location: {location}
                </Text>
                <Group mt={15} spacing="xl" grow>
                  <Button
                    size={'xs'}
                    variant="outline"
                    onClick={() => GetDirection(item.user._id, item.owner_id)}
                  >
                    Get Location
                  </Button>
                  <Button
                    color={'pink'}
                    size={'xs'}
                    onClick={() => {
                      socket.emit(
                        'Get_SOS_Accepted_List',
                        item.owner_id,
                        (data) => {
                          setAcceptedList(data)
                        },
                      )
                    }}
                  >
                    Accepted Users
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          )
        })}
      </Grid>
    </div>
  )
}

export default AllSOS
